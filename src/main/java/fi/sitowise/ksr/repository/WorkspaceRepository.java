package fi.sitowise.ksr.repository;

import fi.sitowise.ksr.domain.Workspace;
import fi.sitowise.ksr.domain.WorkspaceLayer;
import fi.sitowise.ksr.jooq.tables.records.WorkspaceLayerRecord;
import fi.sitowise.ksr.jooq.tables.records.WorkspaceRecord;
import org.apache.commons.lang3.StringUtils;
import org.jooq.DSLContext;
import org.jooq.exception.DataAccessException;
import org.jooq.impl.DSL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

import static fi.sitowise.ksr.jooq.Tables.*;

/**
 * Workspace repository.
 */
@Repository
public class WorkspaceRepository {
    private DSLContext context;

    /**
     * Instantiates new workspace repository.
     *
     * @param context Configuration context
     */
    @Autowired
    public WorkspaceRepository(DSLContext context) {
        this.context = context;
    }

    /**
     * Save new workspace to database. If the user already has a workspace
     * saved with the given name delete existing workspace before saving
     * the new one.
     *
     * @param workspace Workspace to be saved.
     * @param username Username of the user that the workspace is saved for.
     */
    @Transactional
    public void saveWorkspace(Workspace workspace, String username) {
        String uuid = deleteWorkspace(workspace.getName(), username);
        Long workspaceId = insertWorkspace(workspace, username, uuid);
        insertWorkspaceLayers(workspaceId, workspace.getLayers());
    }

    /**
     * Delete existing workspace for given user.
     *
     * @param name Name of the workspace to be deleted.
     * @param username Username of the user whose workspace is being deleted.
     *
     * @return Deleted workspace uuid if workspace existed.
     */
    public String deleteWorkspace(String name, String username) {
        return context
                .deleteFrom(WORKSPACE)
                .where(WORKSPACE.NAME.equal(name))
                .and(WORKSPACE.USERNAME.equal(username))
                .returning(WORKSPACE.UUID)
                .fetchOne()
                .getUuid();
    }

    /**
     * Insert new workspace to database.
     *
     * @param workspace Workspace to be inserted into the database.
     * @param username Username of the user whose workspace is being saved.
     * @param uuid Uuid of deleted workspace if exists.
     * 
     * @return Id of the inserted workspace.
     */
    private Long insertWorkspace(Workspace workspace, String username, String uuid) {
        return context
                .insertInto(
                        WORKSPACE,
                        WORKSPACE.UUID,
                        WORKSPACE.NAME,
                        WORKSPACE.USERNAME,
                        WORKSPACE.SCALE,
                        WORKSPACE.CENTER_LONGITUDE,
                        WORKSPACE.CENTER_LATITUDE
                )
                .values(
                        StringUtils.isNotEmpty(uuid) ? uuid : UUID.randomUUID().toString(),
                        workspace.getName(),
                        username,
                        workspace.getScale(),
                        workspace.getCenterLongitude(),
                        workspace.getCenterLatitude()
                )
                .returning(WORKSPACE.ID)
                .fetchOne()
                .getId();
    }

    /**
     * Insert layer details for a workspace into database.
     *
     * @param workspaceId Id the workspace that the layer details belong to
     * @param layers Layer details to be inserted
     * @throws DataAccessException If saving workspace layers fails
     */
    private void insertWorkspaceLayers(Long workspaceId, List<WorkspaceLayer> layers)
            throws DataAccessException {
        try {
            context
                    .loadInto(WORKSPACE_LAYER)
                    .loadArrays(layers.stream().map(row -> new Object[]{
                            workspaceId,
                            row.getLayerId(),
                            row.getUserLayerId(),
                            row.getVisible() ? "1" : "0",
                            row.getOpacity(),
                            row.getLayerOrder(),
                            row.getDefinitionExpression(),
                            row.getSelectedFeatures()
                    }))
                    .fields(
                            WORKSPACE_LAYER.WORKSPACE_ID,
                            WORKSPACE_LAYER.LAYER_ID,
                            WORKSPACE_LAYER.USER_LAYER_ID,
                            WORKSPACE_LAYER.VISIBLE,
                            WORKSPACE_LAYER.OPACITY,
                            WORKSPACE_LAYER.LAYER_ORDER,
                            WORKSPACE_LAYER.DEFINITION_EXPRESSION,
                            WORKSPACE_LAYER.SELECTED_FEATURES
                    )
                    .execute();
        } catch (IOException e) {
            throw new DataAccessException("Saving workspace layers failed.", e);
        }
    }

    /**
     * Check workspace name existence in database for a user.
     *
     * @param username Name of user.
     * @param name Name of the workspace.
     *
     * @return Workspace name existence.
     */
    public boolean getWorkspaceExistence(String username, String name) {
        return context.fetchExists(
                DSL.selectOne()
                        .from(WORKSPACE)
                        .where(WORKSPACE.NAME.equal(name))
                        .and(WORKSPACE.USERNAME.equal(username))
        );
    }

    /**
     * Fetch list of workspaces for given username. Will sort workspaces
     * by their updated time.
     *
     * @param username Username of the user whose workspaces are fetched.
     *
     * @return List of workspaces sorted by updated time.
     */
    public List<Workspace> fetchWorkspaceListForUser(String username) {
        return context
                .selectFrom(WORKSPACE)
                .where(WORKSPACE.USERNAME.equal(username))
                .orderBy(WORKSPACE.UPDATED.desc())
                .fetch(w -> new Workspace(w, null));
    }

    /**
     * Fetch details for given workspace. If workspace name is not given
     * return latest workspace for the user.
     *
     * @param workspaceName Name of the workspace to be fetched.
     * @param username Username of the user whose workspace is fetched.
     *
     * @return Workspace and layer details.
     */
    @Transactional
    public Workspace fetchWorkspaceDetails(String workspaceName, String username) {
        WorkspaceRecord workspace = context
                .selectFrom(WORKSPACE)
                .where(WORKSPACE.USERNAME.equal(username))
                    .and(workspaceName != null ?
                            WORKSPACE.NAME.equal(workspaceName) : DSL.trueCondition())
                .orderBy(WORKSPACE.UPDATED.desc())
                .limit(1)
                .fetchOne();

        if (workspace != null) {
            List<WorkspaceLayerRecord> layers = context
                    .selectFrom(WORKSPACE_LAYER)
                    .where(WORKSPACE_LAYER.WORKSPACE_ID.equal(workspace.getId()))
                    .orderBy(WORKSPACE_LAYER.LAYER_ORDER)
                    .fetch();

            context
                    .update(WORKSPACE)
                    .set(WORKSPACE.UPDATED, DSL.currentTimestamp())
                    .where(WORKSPACE.ID.equal(workspace.getId()))
                    .execute();

            return new Workspace(workspace, layers);
        }

        return null;
    }

    /**
     * Fetch a single workspace by uuid. If not matching workspace can be found,
     * then returns null instead.
     *
     * Filters out layers the user does not have a permission and also user defined layers.
     *
     * @param uuid Uuid of the workspace.
     * 
     * @return Workspace if found.
     */
    @Transactional
    public Workspace fetchWorkspaceByUuid(UUID uuid, List<String> userGroups) {
        WorkspaceRecord wr = context
                .selectFrom(WORKSPACE)
                .where(WORKSPACE.UUID.equal(uuid.toString()))
                .fetchOne();

        if (wr != null) {
            List<WorkspaceLayerRecord> layers = context
                    .select(WORKSPACE_LAYER.fields())
                    .from(WORKSPACE_LAYER)
                    .innerJoin(LAYER_PERMISSION).on(LAYER_PERMISSION.LAYER_ID.equal(WORKSPACE_LAYER.LAYER_ID))
                    .where(WORKSPACE_LAYER.WORKSPACE_ID.equal(wr.getId()))
                        .and(LAYER_PERMISSION.USER_GROUP.in(userGroups))
                        .and(LAYER_PERMISSION.READ_LAYER.equal("1"))
                        .and(WORKSPACE_LAYER.USER_LAYER_ID.isNull())
                    .orderBy(WORKSPACE_LAYER.LAYER_ORDER)
                    .fetchInto(WORKSPACE_LAYER);
            return new Workspace(wr, layers);
        }
        return null;
    }
}
