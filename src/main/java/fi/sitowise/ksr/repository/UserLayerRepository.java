package fi.sitowise.ksr.repository;

import fi.sitowise.ksr.domain.Layer;
import fi.sitowise.ksr.exceptions.KsrApiException;
import fi.sitowise.ksr.jooq.tables.records.UserLayerRecord;
import fi.sitowise.ksr.jooq.udt.records.QueryColumnTypeRecord;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jooq.DSLContext;
import org.jooq.exception.DataAccessException;
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
     * Adds new layer to USER_LAYER table.
     * Current user's name is used as identifier.
     *
     * @param layer user layer to be added
     * @param username username of current user
     *
     * @return id of the newly added layer
     */
    public int addUserLayer(Layer layer, String username) throws DataAccessException {
        Long workspaceId = context
                .insertInto(
                        USER_LAYER,
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
                        USER_LAYER.QUERY_COLUMNS,
                        USER_LAYER.USERNAME
                    )
                .values(
                        layer.getName(),
                        layer.getType(),
                        layer.getUrl(),
                        layer.getLayers(),
                        layer.getStyles().equals("") ? "default" : layer.getStyles(),
                        BigDecimal.valueOf(layer.getOpacity()),
                        layer.getMinScale(),
                        layer.getMaxScale(),
                        layer.getAttribution(),
                        layer.getTransparent() ? "1" : "0",
                        layer.getDesktopVisible() ? "1" : "0",
                        layer.getMobileVisible() ? "1" : "0",
                        layer.isQueryable() ? "1" : "0",
                        layer.getQueryColumnsCustom(),
                        username
                )
                .returning(USER_LAYER.ID)
                .fetchOne()
                .getId();

        return toIntExact(workspaceId);
    }

    /**
     * Remove user layer from database.
     *
     * @param username username of the layer owner
     * @param userLayerId id of the layer
     * @throws KsrApiException if layer is not found for given user
     */
    public void removeUserLayer(String username, int userLayerId) throws KsrApiException {
        int rowsRemoved = context
                .delete(USER_LAYER)
                .where(USER_LAYER.ID.equal(Long.valueOf(userLayerId))
                    .and(USER_LAYER.USERNAME.equal(username)))
                .execute();

        if (rowsRemoved > 0) {
            log.info(String.format("Userlayer: [%d] succesfully removed by user: [%s].",
                    userLayerId, username));
        } else {
            throw new KsrApiException.NotFoundErrorException(
                    String.format("Userlayer: [%d] not found for user: [%s].", userLayerId, username)
            );
        }
    }
}
