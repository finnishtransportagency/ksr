package fi.sitowise.ksr.service;

import fi.sitowise.ksr.domain.Layer;
import fi.sitowise.ksr.exceptions.KsrApiException;
import fi.sitowise.ksr.repository.UserLayerRepository;
import org.springframework.stereotype.Service;

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
     */
    public void addUserLayer(String username, Layer layer) {
        String transparent = layer.getTransparent() ? "1" : "0";
        String desktopVisible = layer.getDesktopVisible() ? "1" : "0";
        String mobileVisible = layer.getMobileVisible() ? "1" : "0";
        String styles = layer.getStyles().equals("") ? "default" : layer.getStyles();

        userLayerRepository.addUserLayer(
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
