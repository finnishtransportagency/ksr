package fi.sitowise.ksr.repository;

import fi.sitowise.ksr.domain.Layer;
import fi.sitowise.ksr.domain.Relation;
import fi.sitowise.ksr.exceptions.KsrApiException;
import fi.sitowise.ksr.jooq.tables.records.RelationRecord;
import fi.sitowise.ksr.jooq.tables.records.UserLayerRecord;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jooq.DSLContext;
import org.jooq.exception.DataAccessException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import static fi.sitowise.ksr.jooq.Tables.RELATION;
import static fi.sitowise.ksr.jooq.Tables.USER_LAYER;
import static java.lang.Math.toIntExact;

/**
 * Relation repository.
 */
@Repository
public class RelationRepository {
    private DSLContext context;

    /**
     * Instantiates a new Relation repository.
     *
     * @param context the context
     */
    @Autowired
    public RelationRepository(DSLContext context) {
        this.context = context;
    }

    /**
     * Gets relations that belong to layer.
     *
     * @param id String layer id.
     * @return Relations List<Relation> containing all relations for the layer.
     */
    public List<Relation> getRelations(String id) {
        List<RelationRecord> relationRecordList = context.select(RELATION.fields())
                .from(RELATION)
                .where(RELATION.LAYER_ID.equal(Long.valueOf(id)))
                .fetchInto(RelationRecord.class);

        List<Relation> relationList = new ArrayList<>();
        for (RelationRecord l : relationRecordList) {
            Relation relation = new Relation(l);
            relationList.add(relation);
        }
        return relationList;
    }
}
