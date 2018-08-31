package fi.sitowise.ksr.repository;

import fi.sitowise.ksr.domain.Layer;
import fi.sitowise.ksr.exceptions.KsrApiException;
import fi.sitowise.ksr.jooq.tables.records.UserLayerRecord;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jooq.DSLContext;
import org.jooq.exception.DataAccessException;
import org.jooq.impl.DSL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import static java.lang.Math.toIntExact;

import static fi.sitowise.ksr.jooq.Tables.USER_LAYER;

/**
 * User Layer repository.
 */
@Repository
public class UserLayerRepository {
    private static Logger log = LogManager.getLogger(UserLayerRepository.class);
    private DSLContext context;

    /**
     * Instantiates a new User Layer repository.
     *
     * @param context the context
     */
    @Autowired
    public UserLayerRepository(DSLContext context) {
        this.context = context;
    }

    /**
     * Gets user layer with id
     *
     * @param id Layer Id
     * @return layer
     */
    public Layer getUserLayer(int id) {
        UserLayerRecord ulr = context.select(USER_LAYER.fields())
                .from(USER_LAYER)
                .where(USER_LAYER.ID.equal(Long.valueOf(id)))
                .fetchOneInto(UserLayerRecord.class);

        return ulr == null ? null : new Layer(ulr);
    }

    /**
     * Gets user layers that belong to current user.
     *
     * @param username String current user
     * @return layers List<Layer> containing all users layers
     */
    public List<Layer> getUserLayers(String username) {
        List<UserLayerRecord> userLayers = context.select(USER_LAYER.fields())
                .from(USER_LAYER)
                .where(USER_LAYER.USERNAME.equal(username))
                .fetchInto(UserLayerRecord.class);

        List<Layer> layers = new ArrayList<>();
        for (UserLayerRecord l : userLayers) {
            Layer newLayer = new Layer(l);
            layers.add(newLayer);
        }
        return layers;
    }

    /**
     * Adds new layer to USER_LAYER table
     * Current users name used as identifier
     *
     * @param name String layer name
     * @param type String layer type
     * @param url String layer url
     * @param layers String layer feature names
     * @param styles String layer styles
     * @param opacity Double layer opacity
     * @param minScale int layer minScale
     * @param maxScale int layer maxScale
     * @param transparent String layer transparent ("1" true, "0" false)
     * @param attribution String layer copyright info
     * @param desktopVisible String layer visibility on desktop ("1" true, "0" false)
     * @param mobileVisible String layer visibility on mobile ("1" true, "0" false)
     * @param username String name of current user
     */
    public void addUserLayer(
            String name,
            String type,
            String url,
            String layers,
            String styles,
            Double opacity,
            int minScale,
            int maxScale,
            String transparent,
            String attribution,
            String desktopVisible,
            String mobileVisible,
            String username
            ) throws DataAccessException {
        context.insertInto(USER_LAYER,
                USER_LAYER.NAME,
                USER_LAYER.TYPE,
                USER_LAYER.URL,
                USER_LAYER.LAYERS,
                USER_LAYER.STYLES,
                USER_LAYER.OPACITY,
                USER_LAYER.MIN_SCALE,
                USER_LAYER.MAX_SCALE,
                USER_LAYER.ATTRIBUTION,
                USER_LAYER.TRANSPARENT,
                USER_LAYER.DESKTOP_VISIBLE,
                USER_LAYER.MOBILE_VISIBLE,
                USER_LAYER.QUERYABLE,
                USER_LAYER.USERNAME)
                .values(
                        name,
                        type,
                        url,
                        layers,
                        styles,
                        BigDecimal.valueOf(opacity),
                        minScale,
                        maxScale,
                        attribution,
                        transparent,
                        desktopVisible,
                        mobileVisible,
                        "0",
                        username
                ).execute();
    }

    /**
     * Gets max layer ID from user layer table
     *
     * @return layer ID
     */
    public int getMaxUserLayerId() throws DataAccessException {
        return toIntExact(context.select(DSL.max(USER_LAYER.ID))
                .from(USER_LAYER)
                .fetchOne(DSL.max(USER_LAYER.ID)));
    }

    /**
     * Remove user layer from database.
     *
     * Throws 404 Exception if layer not found for given user.
     *
     * @param username String username of the layer owner
     * @param userLayerId int Id of the layer
     */
    public void removeUserLayer(String username, int userLayerId) throws KsrApiException {
        Integer rowCount = context.select(USER_LAYER.fields())
                .from(USER_LAYER)
                .where(USER_LAYER.ID.eq(Long.valueOf(userLayerId)).and(USER_LAYER.USERNAME.eq(username))).execute();
        if (rowCount.equals(1)) { // Check that layer exists
            context.delete(USER_LAYER)
                    .where(USER_LAYER.ID.eq(Long.valueOf(userLayerId)).and(USER_LAYER.USERNAME.eq(username))).execute();
            log.info(String.format("Userlayer: [%d] succesfully removed by user: [%s].", userLayerId, username));
        } else {
            throw new KsrApiException.NotFoundErrorException(
                    String.format("Userlayer: [%d] not found for user: [%s].", userLayerId, username)
            );
        }
    }
}
