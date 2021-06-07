package fi.sitowise.ksr.repository;

import fi.sitowise.ksr.domain.Layer;
import fi.sitowise.ksr.domain.LayerAction;
import fi.sitowise.ksr.jooq.tables.records.LayerPermissionRecord;
import fi.sitowise.ksr.jooq.tables.records.LayerRecord;
import org.jooq.DSLContext;
import org.jooq.Record1;
import org.jooq.impl.DSL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.stream.Collectors;

import static fi.sitowise.ksr.jooq.Tables.*;

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
     * Get all layers that have relation to given layer.
     *
     * @param id Id of the layer.
     * @param userGroups List of user groups.
     * @return List of layers that have relation to given layer.
     */
    @Cacheable("get_referencing_layers")
    public List<Layer> getReferencingLayers(int id, List<String> userGroups) {
        return context.select(LAYER.fields())
                .from(LAYER)
                .join(LAYER_PERMISSION)
                    .on(LAYER_PERMISSION.LAYER_ID.equal(LAYER.ID))
                .join(RELATION)
                    .on(RELATION.LAYER_ID.equal(LAYER.ID))
                .where(RELATION.RELATION_LAYER_ID.equal(Long.valueOf(id)))
                .and(LAYER_PERMISSION.USER_GROUP.in(userGroups))
                .and(LAYER_PERMISSION.READ_LAYER.equal("1"))
                .fetchInto(LayerRecord.class)
                .stream()
                .map(lr -> new Layer(lr, null))
                .collect(Collectors.toList());
    }

    /**
     * Gets layer.
     *
     * @param id layer's id
     * @param userGroups user groups
     * @param isQuery whether the layer is requested for a search request or not
     * @return the layer
     */
    @Cacheable("get_layer")
    public Layer getLayer(int id, List<String> userGroups, boolean isQuery, LayerAction actionType) {
        return context
            .select(LAYER.fields())
            .select(LAYER_PERMISSION.fields())
            .from(LAYER)
            .join(LAYER_PERMISSION)
                .on(LAYER_PERMISSION.LAYER_ID.equal(LAYER.ID))
            .where(LAYER.ID.equal(Long.valueOf(id)))
                .and(
                        actionType.equals(LayerAction.READ_LAYER) ?
                                LAYER_PERMISSION.READ_LAYER.equal("1") : DSL.trueCondition()
                )
                .and(
                        actionType.equals(LayerAction.DELETE_LAYER) ?
                                LAYER_PERMISSION.DELETE_LAYER.equal("1") : DSL.trueCondition()
                )
                .and(
                        actionType.equals(LayerAction.CREATE_LAYER) ?
                                LAYER_PERMISSION.CREATE_LAYER.equal("1") : DSL.trueCondition()
                )
                .and(
                        actionType.equals(LayerAction.UPDATE_LAYER) ?
                                LAYER_PERMISSION.UPDATE_LAYER.equal("1") : DSL.trueCondition()
                )
                .and(LAYER_PERMISSION.USER_GROUP.in(userGroups))
                .and(isQuery ? LAYER.TYPE.in("agfs", "agfl") : DSL.trueCondition())
            .fetchOne(r -> new Layer(
                    r.into(LayerRecord.class),
                    r.into(LayerPermissionRecord.class)
            ));
    }

    @Cacheable("get_layer_by_name")
    public Layer getLayerByName(String name) {
        return context
                .selectFrom(LAYER)
                .where(LAYER.NAME.equal(name))
                .fetchOne(r -> new Layer(
                        r.into(LayerRecord.class),
                        r.into(LayerPermissionRecord.class)
                ));
    }
}
