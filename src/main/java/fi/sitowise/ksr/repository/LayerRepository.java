package fi.sitowise.ksr.repository;

import fi.sitowise.ksr.domain.Layer;
import fi.sitowise.ksr.jooq.tables.records.LayerRecord;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

import static fi.sitowise.ksr.jooq.Tables.LAYER;
import static fi.sitowise.ksr.jooq.Tables.LAYER_PERMISSION;

/**
 * Layer repository.
 */
@Repository
public class LayerRepository {
    private DSLContext context;

    /**
     * Instantiates a new Layer repository.
     *
     * @param context the context
     */
    @Autowired
    public LayerRepository(DSLContext context) {
        this.context = context;
    }

    /**
     * Gets layer.
     *
     * @param id         the layer id
     * @param userGroups the user groups
     * @return the layer
     */
    public Layer getLayer(int id, List<String> userGroups) {
        LayerRecord lr = context.select(LAYER.fields())
                .from(LAYER)
                .join(LAYER_PERMISSION)
                    .on(LAYER_PERMISSION.LAYER_ID.equal(LAYER.ID))
                .where(LAYER.ID.equal(Long.valueOf(id)))
                    .and(LAYER_PERMISSION.READ_LAYER.equal("1"))
                    .and(LAYER_PERMISSION.USER_GROUP.in(userGroups))
                .fetchOneInto(LayerRecord.class);

        return lr == null ? null : new Layer(lr);
    }
}
