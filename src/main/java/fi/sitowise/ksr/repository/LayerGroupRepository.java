package fi.sitowise.ksr.repository;

import fi.sitowise.ksr.domain.LayerGroup;
import fi.sitowise.ksr.jooq.tables.records.LayerGroupRecord;
import fi.sitowise.ksr.jooq.tables.records.LayerRecord;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static fi.sitowise.ksr.jooq.Tables.LAYER_GROUP;
import static fi.sitowise.ksr.jooq.Tables.LAYER;
import static fi.sitowise.ksr.jooq.Tables.LAYER_PERMISSION;

/**
 * The type Layer group repository.
 */
@Repository
public class LayerGroupRepository {

    /**
     * The Context.
     */
    private final DSLContext context;

    @Autowired
    public LayerGroupRepository(DSLContext context) {
        this.context = context;
    }

    /**
     * Returns a List of LayerGroups visible for given userGroups.
     *
     * @param userGroups List of KSR usergroups.
     * @return List of LayerGroups
     */
    public List<fi.sitowise.ksr.domain.LayerGroup> getLayerGroups(List<String> userGroups) {
        Map<LayerGroupRecord, List<LayerRecord>> groups =
                this.context.select(LAYER_GROUP.fields())
                        .select(LAYER.fields())
                        .from(LAYER_GROUP)
                        .join(LAYER).on(LAYER.LAYER_GROUP_ID.equal(LAYER_GROUP.ID))
                        .join(LAYER_PERMISSION).on(LAYER_PERMISSION.LAYER_ID.equal(LAYER.ID))
                        .where(LAYER_PERMISSION.READ_LAYER.eq("1"))
                        .and(LAYER_PERMISSION.USER_GROUP.in(userGroups))
                .fetchGroups(
                    r -> r.into(LAYER_GROUP).into(LayerGroupRecord.class),
                    r -> r.into(LAYER).into(LayerRecord.class)
                );

        List<fi.sitowise.ksr.domain.LayerGroup> layerGroups = groups.entrySet().stream().map(
                e -> new LayerGroup(e.getKey(), e.getValue())
        ).collect(Collectors.toList());

        return layerGroups;
    }
}
