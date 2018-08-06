package fi.sitowise.ksr.service;

import fi.sitowise.ksr.controller.ProxyController;
import fi.sitowise.ksr.domain.Layer;
import fi.sitowise.ksr.domain.LayerGroup;
import fi.sitowise.ksr.repository.LayerGroupRepository;
import fi.sitowise.ksr.utils.KsrStringUtils;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;

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
        LayerGroup lg = new LayerGroup();
        lg.setId(123);

        Mockito.when(layerGroupRepository.getLayerGroups(Mockito.anyList())).thenReturn(Collections.singletonList(lg));
        Assert.assertEquals(Collections.singletonList(lg), layerGroupService.getLayerGroups(isMobile));
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
}
