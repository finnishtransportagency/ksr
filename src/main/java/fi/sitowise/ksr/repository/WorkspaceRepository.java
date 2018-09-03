package fi.sitowise.ksr.repository;

import fi.sitowise.ksr.domain.Workspace;
import fi.sitowise.ksr.domain.WorkspaceLayer;
import org.jooq.DSLContext;
import org.jooq.exception.DataAccessException;
import org.jooq.impl.DSL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.sql.Timestamp;
import java.util.List;
import java.util.Map;

import static fi.sitowise.ksr.jooq.Tables.WORKSPACE;
import static fi.sitowise.ksr.jooq.Tables.WORKSPACE_LAYER;

/**
 * Workspace repository.
 */
@Repository
public class WorkspaceRepository {
    private DSLContext context;

    /**
     * Instantiates new workspace repository.
     *
     * @param context configuration context
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
     * @param workspace workspace to be saved
     * @param username username of the user that the workspace is saved for
     */
    @Transactional
    public void saveWorkspace(Workspace workspace, String username) {
        deleteWorkspace(workspace.getName(), username);

        Long workspaceId = insertWorkspace(workspace, username);
        insertWorkspaceLayers(workspaceId, workspace.getLayers());
    }

    /**
     * Delete existing workspace for given user.
     *
     * @param name name of the workspace to be deleted
     * @param username username of the user whose workspace is being deleted
     * @return whether a workspace is deleted or not
     */
    public boolean deleteWorkspace(String name, String username) {
        return context
                .deleteFrom(WORKSPACE)
                .where(WORKSPACE.NAME.equal(name))
                    .and(WORKSPACE.USERNAME.equal(username))
                .execute() > 0;
    }

    /**
     * Insert new workspace to database.
     *
     * @param workspace workspace to be inserted into the database
     * @param username username of the user whose workspace is being saved
     * @return id of the inserted workspace
     */
    private Long insertWorkspace(Workspace workspace, String username) {
        context
                .insertInto(
                        WORKSPACE,
                        WORKSPACE.NAME,
                        WORKSPACE.USERNAME,
                        WORKSPACE.SCALE,
                        WORKSPACE.CENTER_LONGITUDE,
                        WORKSPACE.CENTER_LATITUDE
                )
                .values(
                        workspace.getName(),
                        username,
                        workspace.getScale(),
                        workspace.getCenterLongitude(),
                        workspace.getCenterLatitude()
                )
                .execute();

        return context
                .select(DSL.max(WORKSPACE.ID))
                .from(WORKSPACE)
                .where(WORKSPACE.USERNAME.equal(username))
                .fetchOne(DSL.max(WORKSPACE.ID));
    }

    /**
     * Insert layer details for a workspace into database.
     *
     * @param workspaceId id the workspace that the layer details belong to
     * @param layers layer details to be inserted
     * @throws DataAccessException if saving workspace layers fails
     */
    private void insertWorkspaceLayers(Long workspaceId, List<WorkspaceLayer> layers)
            throws DataAccessException {
        try {
            context
                    .loadInto(WORKSPACE_LAYER)
                    .loadArrays(layers.stream().map(row -> new Object[] {
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
     * @param username name of user
     * @param name name of the workspace
     * @return workspace name existence
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
     * Fetch map of workspace names and update times for given user.
     *
     * @param username username of the user whose workspaces are fetched
     * @return map of workspace names and update times
     */
    public Map<String, Timestamp> fetchWorkspaceListForUser(String username) {
        return context
                .select(
                        WORKSPACE.NAME,
                        WORKSPACE.UPDATED
                )
                .from(WORKSPACE)
                .where(WORKSPACE.USERNAME.equal(username))
                .orderBy(WORKSPACE.UPDATED.desc())
                .fetchMap(WORKSPACE.NAME, WORKSPACE.UPDATED);
    }
}
