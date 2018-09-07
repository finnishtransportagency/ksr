package fi.sitowise.ksr.service;

import fi.sitowise.ksr.domain.Layer;
import fi.sitowise.ksr.exceptions.KsrApiException;
import fi.sitowise.ksr.repository.UserLayerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * User Layer service.
 */
@Service
public class UserLayerService {

    private final UserLayerRepository userLayerRepository;

    /**
     * Instantiates a new User Layer service.
     *
     * @param userLayerRepository the user layer repository
     */
    public UserLayerService(UserLayerRepository userLayerRepository) {
        this.userLayerRepository = userLayerRepository;
    }

    /**
     * Adds user layer.
     *
     * @param username String name of current user
     * @param layer Layer object generated from data sent from frontend layer creation
     * @param isMobile boolean for checking if current device is mobile
     *
     * @return user layer that was inserted into database
     */
    @Transactional
    public Layer addUserLayer(String username, Layer layer, boolean isMobile) {
        String transparent = layer.getTransparent() ? "1" : "0";
        String desktopVisible = layer.getDesktopVisible() ? "1" : "0";
        String mobileVisible = layer.getMobileVisible() ? "1" : "0";
        String styles = layer.getStyles().equals("") ? "default" : layer.getStyles();

        int id = userLayerRepository.addUserLayer(
                layer.getName(),
                layer.getType(),
                layer.getUrl(),
                layer.getLayers(),
                styles,
                layer.getOpacity(),
                layer.getMinScale(),
                layer.getMaxScale(),
                transparent,
                layer.getAttribution(),
                desktopVisible,
                mobileVisible,
                username
        );

        Layer newLayer = userLayerRepository.getUserLayer(id);
        newLayer.setVisible(isMobile ? newLayer.getMobileVisible() : newLayer.getDesktopVisible());

        return newLayer;
    }

    /**
     * Remove user layer by id
     * @param username String name of current user
     * @param userLayerId int Id of the layer to be removed
     */
    public void removeUserLayer(String username, int userLayerId) throws KsrApiException {
        if (username == null) {
            throw new KsrApiException.ForbiddenException("Error authenticating user.");
        }
        userLayerRepository.removeUserLayer(username, userLayerId);
    }
}
