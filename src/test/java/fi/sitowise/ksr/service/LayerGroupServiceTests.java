package fi.sitowise.ksr.service;

import fi.sitowise.ksr.controller.ProxyController;
import fi.sitowise.ksr.domain.Layer;
import fi.sitowise.ksr.domain.LayerGroup;
import fi.sitowise.ksr.repository.LayerGroupRepository;
import fi.sitowise.ksr.repository.UserLayerRepository;
import fi.sitowise.ksr.utils.KsrStringUtils;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.hamcrest.beans.SamePropertyValuesAs.samePropertyValuesAs;

/**
 * Layer group service tests.
 */
@RunWith(SpringRunner.class)
@ContextConfiguration(classes = LayerGroupService.class)
public class LayerGroupServiceTests {

    /**
     * The Layer group service.
     */
    @Autowired
    LayerGroupService layerGroupService;

    /**
     * The Layer group repository.
     */
    @MockBean
    LayerGroupRepository layerGroupRepository;
    private boolean isMobile = false;

    /**
     * The User Layer repository.
     */
    @MockBean
    UserLayerRepository userLayerRepository;

    /**
     * Test get user groups with roles.
     */
    @Test
    @WithMockUser(username = "mock-user", roles = {"ADMIN", "USER"})
    public void testGetUserGroupsWithRoles() {
        Assert.assertEquals(Arrays.asList("ROLE_ADMIN", "ROLE_USER"), layerGroupService.getUserGroups());
    }

    /**
     * Test get user groups without roles.
     */
    @Test
    @WithMockUser(username = "mock-user", roles = {})
    public void testGetUserGroupsWithoutRoles() {
        Assert.assertEquals(Collections.emptyList(), layerGroupService.getUserGroups());
    }

    /**
     * Test get user groups without auth.
     */
    @Test
    public void testGetUserGroupsWithoutAuth() {
        Assert.assertNull(layerGroupService.getUserGroups());
    }

    /**
     * Test get layer groups.
     */
    @Test
    @WithMockUser(username = "mock-user", roles = {"ADMIN", "USER"})
    public void testGetLayerGroups() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        LayerGroup lg = new LayerGroup();
        lg.setId(123);
        lg.setGroupOrder(1);

        LayerGroup ulg = new LayerGroup();
        ulg.setName("Käyttäjätasot");
        ulg.setId(124);
        ulg.setGroupOrder(2);
        ulg.setLayers(userLayerRepository.getUserLayers(authentication.getName()));

        List<LayerGroup> combinedLayerGroups = new ArrayList<>();
        combinedLayerGroups.add(lg);
        combinedLayerGroups.add(ulg);

        Mockito.when(layerGroupRepository.getLayerGroups(Mockito.anyList())).thenReturn(Collections.singletonList(lg));
        Assert.assertThat(combinedLayerGroups, samePropertyValuesAs(layerGroupService.getLayerGroups(isMobile)));
    }

    /**
     * Test get layer groups, modify layer url.
     */
    @Test
    @WithMockUser(username = "mock-user", roles = {"ADMIN", "USER"})
    public void testGetLayerGroupsModifyLayerUrl() {
        String contextPath = "${server.servlet.context-path}";

        LayerGroup lg = new LayerGroup();
        lg.setId(123);

        Layer l1 = new Layer();
        l1.setId("321");
        l1.setUrl("https://test.example.com");

        Layer l2 = new Layer();
        l2.setId("543");
        l2.setUrl("https://2.test.example.com");

        lg.setLayers(Arrays.asList(l1, l2));

        Mockito.when(layerGroupRepository.getLayerGroups(Mockito.anyList())).thenReturn(Collections.singletonList(lg));
        for (LayerGroup lgr : layerGroupService.getLayerGroups(false)) {
            for (Layer lr : lgr.getLayers()) {
                String formatUrl = String.format("%s/%s/%s/", contextPath, ProxyController.PROXY_URL, lr.getId());
                Assert.assertEquals(KsrStringUtils.replaceMultipleSlashes(formatUrl), lr.getUrl());
            }
        }
    }

    /**
     * Test get layer groups without user.
     */
    @Test
    @WithMockUser(username = "mock-user", roles = {})
    public void testGetLayerGroupsWithoutUser() {
        Mockito.when(layerGroupRepository.getLayerGroups(Mockito.anyList())).thenReturn(new ArrayList<>());
        Assert.assertEquals(new ArrayList<>(), layerGroupService.getLayerGroups(isMobile));
    }

    @Test
    public void testCreateUserLayerGroup() {
        LayerGroup lg = new LayerGroup();
        lg.setId(123);
        lg.setGroupOrder(1);

        List<LayerGroup> layerGroup = new ArrayList<>();
        layerGroup.add(lg);

        LayerGroup expectedLayerGroup = new LayerGroup();
        expectedLayerGroup.setId(124);
        expectedLayerGroup.setGroupOrder(2);
        expectedLayerGroup.setName("Käyttäjätasot");
        expectedLayerGroup.setLayers(new ArrayList<>());

        List<Layer> layerList = new ArrayList<>();
        Mockito.when(userLayerRepository.getUserLayers(Mockito.anyString())).thenReturn(layerList);
        Assert.assertThat(expectedLayerGroup, samePropertyValuesAs(layerGroupService.createUserLayerGroup(layerGroup)));
    }
}
