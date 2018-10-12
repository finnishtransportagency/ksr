package fi.sitowise.ksr.service;

import fi.sitowise.ksr.domain.Layer;
import fi.sitowise.ksr.domain.LayerGroup;
import fi.sitowise.ksr.repository.LayerGroupRepository;
import fi.sitowise.ksr.repository.UserLayerRepository;
import fi.sitowise.ksr.utils.KsrStringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

import static fi.sitowise.ksr.utils.KsrAuthenticationUtils.getAuthentication;
import static fi.sitowise.ksr.utils.KsrAuthenticationUtils.getCurrentUsername;
import static fi.sitowise.ksr.utils.KsrStringUtils.formatLayerUrl;

/**
 * Layer group service.
 */
@Service
public class LayerGroupService {

    private final LayerGroupRepository layerGroupRepository;
    private final UserLayerRepository userLayerRepository;

    private static final Logger LOG = LogManager.getLogger(LayerGroupService.class);

    /**
     * Instantiates a new Layer group service.
     *
     * @param layerGroupRepository the layer group repository
     * @param userLayerRepository the user layer repository
     */
    public LayerGroupService(LayerGroupRepository layerGroupRepository, UserLayerRepository userLayerRepository) {
        this.layerGroupRepository = layerGroupRepository;
        this.userLayerRepository = userLayerRepository;
    }

    /**
     * Get Layergroups the user has permission and layers that belong to current user
     *
     * @param isMobile the is mobile or desktop browser
     * @return List of LayerGroups
     */
    public List<LayerGroup> getLayerGroups(boolean isMobile) {
        List<String> userGroups = getUserGroups();
        if (userGroups == null) {
            return new ArrayList<>();
        }

        List<LayerGroup> layerGroups = layerGroupRepository.getLayerGroups(userGroups);
        List<LayerGroup> combinedLayerGroups = new ArrayList<>(layerGroups);
        if (layerGroups.size() > 0) {
            combinedLayerGroups.add(createUserLayerGroup(layerGroups));
        }

        for (LayerGroup lg : combinedLayerGroups) {
            if (lg.getLayers() != null) {
                for (Layer l : lg.getLayers()) {
                    l.setVisible(isMobile ? l.getMobileVisible() : l.getDesktopVisible());
                    l.setUrl(formatLayerUrl(l.getType(), l.getId()));
                }
            }
        }

        if (combinedLayerGroups.size() < 1) {
            LOG.info(String.format("%s: User does not have any layergroups or layers.", getCurrentUsername()));
        }

        return combinedLayerGroups;
    }

    /**
     * Get List of users usergroups.
     *
     * @return List of usergroups
     */
    public List<String> getUserGroups() {
        Authentication auth = getAuthentication();
        if (auth != null) {
            Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();
            if (authorities == null) {
                return null;
            }
            return authorities.stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList());
        }
        return null;
    }

    /**
     * Adds user layer.
     *
     * @return layerGroups list of LayerGroup that doesn't include user layers
     */
     LayerGroup createUserLayerGroup(List<LayerGroup> layerGroups) {
         int maxId = Collections.max(layerGroups, Comparator.comparing(LayerGroup::getId)).getId();
         int maxGroupOrder = Collections.max(layerGroups, Comparator.comparing(LayerGroup::getGroupOrder)).getGroupOrder();
         Authentication authentication = getAuthentication();

         LayerGroup layerGroup = new LayerGroup();
         layerGroup.setName("Käyttäjätasot");
         layerGroup.setId(maxId + 1);
         layerGroup.setGroupOrder(maxGroupOrder + 1);

         layerGroup.setLayers(authentication != null
                 ? userLayerRepository.getUserLayers(authentication.getName())
                 : new ArrayList<>()
         );

         return layerGroup;
    }
}
