package fi.sitowise.ksr.service;

import fi.sitowise.ksr.domain.LayerGroup;
import fi.sitowise.ksr.repository.LayerGroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

/**
 * The type Layer group service.
 */
@Service
public class LayerGroupService {

    private final LayerGroupRepository layerGroupRepository;

    @Autowired
    public LayerGroupService(LayerGroupRepository layerGroupRepository) {
        this.layerGroupRepository = layerGroupRepository;
    }

    /**
     * Get Layergroups the user has permission.
     *
     * @return List of LayerGroups
     */
    public List<LayerGroup> getLayerGroups() {
        List<String> userGroups = getUserGroups();
        if (userGroups == null) {
            return new ArrayList<>();
        }
        return this.layerGroupRepository.getLayerGroups(userGroups);
    }

    /**
     * Get List of users usergroups.
     *
     * @return List of usergroups
     */
    public List<String> getUserGroups() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            Collection<? extends  GrantedAuthority> authorities = auth.getAuthorities();
            if (authorities == null) {
                return null;
            }
            return authorities.stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList());
        }
        return null;
    }
}
