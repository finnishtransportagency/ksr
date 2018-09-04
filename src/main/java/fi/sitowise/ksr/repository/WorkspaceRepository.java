package fi.sitowise.ksr.repository;

import org.jooq.DSLContext;
import org.jooq.impl.DSL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import static fi.sitowise.ksr.jooq.Tables.WORKSPACE;

/**
 * Workspace repository.
 */
@Repository
public class WorkspaceRepository {
    private DSLContext context;

    /**
     * Instantiates a new Workspace repository.
     *
     * @param context configuration context
     */
    @Autowired
    public WorkspaceRepository(DSLContext context) {
        this.context = context;
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
}
