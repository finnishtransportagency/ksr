package fi.sitowise.ksr.service;

import fi.sitowise.ksr.controller.ProxyController;
import fi.sitowise.ksr.domain.Layer;
import fi.sitowise.ksr.domain.LayerGroup;
import fi.sitowise.ksr.repository.LayerGroupRepository;
import fi.sitowise.ksr.utils.KsrStringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Layer group service.
 */
@Service
public class LayerGroupService {

    @Value("${server.servlet.context-path}")
    private String contextPath;

    private final LayerGroupRepository layerGroupRepository;

    /**
     * Instantiates a new Layer group service.
     *
     * @param layerGroupRepository the layer group repository
     */
    public LayerGroupService(LayerGroupRepository layerGroupRepository) {
        this.layerGroupRepository = layerGroupRepository;
    }

    /**
     * Get Layergroups the user has permission.
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
        for (LayerGroup lg : layerGroups) {
            if (lg.getLayers() != null) {
                for (Layer l : lg.getLayers()) {
                    String formatUrl = String.format("%s/%s/%s/", contextPath, ProxyController.PROXY_URL, l.getId());

                    l.setVisible(isMobile ? l.getMobileVisible() : l.getDesktopVisible());
                    l.setUrl(KsrStringUtils.replaceMultipleSlashes(formatUrl));
                }
            }
        }
        return layerGroups;
    }

    /**
     * Get List of users usergroups.
     *
     * @return List of usergroups
     */
    public List<String> getUserGroups() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();
            if (authorities == null) {
                return null;
            }
            return authorities.stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList());
        }
        return null;
    }
}
