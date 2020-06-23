package fi.sitowise.ksr.controller;

import fi.sitowise.ksr.domain.Layer;
import fi.sitowise.ksr.domain.LayerAction;
import fi.sitowise.ksr.domain.esri.Response;
import fi.sitowise.ksr.helper.AuthControllerTestBase;
import fi.sitowise.ksr.service.ContractService;
import fi.sitowise.ksr.service.LayerService;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;

@RunWith(SpringRunner.class)
@WebMvcTest(controllers = { ContractController.class })
public class ContractControllerTests extends AuthControllerTestBase {

    @MockBean
    ContractService contractService;

    @MockBean
    LayerService layerService;

    @Before
    public void setUp() {
        init();
    }

    @Test
    public void testGetContractsNoPermissionForLayer() throws Exception {
        Mockito.when(layerService.getLayer(Mockito.eq(654), Mockito.anyBoolean(), Mockito.any(LayerAction.class)))
                .thenReturn(null);

        this.mockMvc.perform(get("/api/contract/654/123")
            .headers(this.getHeadersWithGroup("KSR_ROLE_ADMIN"))
        ).andExpect(status().isNotFound());
    }

    @Test
    public void testGetContractsLayerHasNoContracts() throws Exception {
        Layer layer = new Layer();
        layer.setHasRelations(false);

        Mockito.when(layerService.getLayer(Mockito.eq(655), Mockito.anyBoolean(), Mockito.any(LayerAction.class)))
                .thenReturn(layer);

        this.mockMvc.perform(get("/api/contract/655/123")
                .headers(this.getHeadersWithGroup("KSR_ROLE_ADMIN"))
        ).andExpect(status().isNotFound());
    }

    @Test
    public void testGetContractsHasOneContract() throws Exception {
        Layer layer = new Layer();
        layer.setId(457L);
        layer.setHasRelations(true);

        Response eqr = new Response();
        eqr.setObjectIdFieldName("OBJECTID");
        eqr.setGlobalIdFieldName("UUID");
        List<Response> leqr = new ArrayList<>();
        leqr.add(eqr);

        Mockito.when(layerService.getLayer(Mockito.eq(457), Mockito.anyBoolean(), Mockito.any(LayerAction.class)))
                .thenReturn(layer);

        Mockito.when(contractService.getContracts(Mockito.any(), Mockito.eq(123)))
                .thenReturn(leqr);

        this.mockMvc.perform(get("/api/contract/457/123")
                .headers(this.getHeadersWithGroup("KSR_ROLE_ADMIN")))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json;charset=utf-8"))
                .andExpect(content().json(
                        "[{" +
                                "\"objectIdFieldName\": \"OBJECTID\"" +
                                ",\"globalIdFieldName\": \"UUID\""+
                                ",\"fields\": null"+
                                ",\"features\": null"+
                                "}]"));
    }

    @Test
    public void testGetContractDetailsNoLayer() throws Exception {
        Mockito.when(layerService.getLayer(Mockito.eq(112233), Mockito.anyBoolean(), Mockito.any()))
                .thenReturn(null);

        this.mockMvc.perform(get("/api/contract/details/112233/123")
                .headers(this.getHeadersWithGroup("KSR_ROLE_ADMIN")))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testGetContractDetailsOk() throws Exception {
        Layer layer = new Layer();
        layer.setId(112233444L);

        Mockito.when(layerService.getLayer(Mockito.eq(112233444), Mockito.anyBoolean(), Mockito.any()))
                .thenReturn(layer);

        Mockito.when(contractService.getContractDetails(Mockito.eq(layer), Mockito.eq(123)))
                .thenReturn(Collections.emptyList());

        this.mockMvc.perform(get("/api/contract/details/112233444/123")
                .headers(this.getHeadersWithGroup("KSR_ROLE_ADMIN")))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));
    }

    @Test
    public void testGetRelatingLayerNoLayer() throws Exception {
        Mockito.when(layerService.getLayer(Mockito.eq(1234567), Mockito.anyBoolean(), Mockito.any()))
                .thenReturn(null);
        this.mockMvc.perform(get("/api/contract/1234567")
                .headers(this.getHeadersWithGroup("KSR_ROLE_ADMIN")))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testGetRelatingLayerOk() throws Exception {
        Layer layer = new Layer();
        layer.setHasRelations(true);
        Mockito.when(layerService.getLayer(Mockito.eq(135), Mockito.anyBoolean(), Mockito.any()))
                .thenReturn(layer);
        Mockito.when(contractService.getRelatingLayer(Mockito.any()))
                .thenReturn(new Layer());
        this.mockMvc.perform(get("/api/contract/135")
                .headers(this.getHeadersWithGroup("KSR_ROLE_ADMIN")))
                .andExpect(status().isOk());
    }

    @Test
    public void testLinkObjectsCreated() throws Exception {
        Layer fromLayer = new Layer();
        fromLayer.setHasRelations(true);

        Layer toLayer = new Layer();

        Mockito.when(layerService.getLayer(Mockito.eq(135), Mockito.anyBoolean(), Mockito.any()))
                .thenReturn(fromLayer);

        Mockito.when(layerService.getLayer(Mockito.eq(531), Mockito.anyBoolean(), Mockito.any()))
                .thenReturn(toLayer);

        Mockito.when(contractService.linkObjects(
                Mockito.eq(fromLayer),
                Mockito.eq(12),
                Mockito.eq(toLayer),
                Mockito.eq(21)
        )).thenReturn(true);


        this.mockMvc.perform(post("/api/contract/link/135/12/531/21")
                .headers(this.getHeadersWithGroup("KSR_ROLE_ADMIN")))
                .andExpect(status().isCreated());
    }

    @Test
    public void testLinkObjectsOk() throws Exception {
        Layer fromLayer = new Layer();
        fromLayer.setHasRelations(true);

        Layer toLayer = new Layer();

        Mockito.when(layerService.getLayer(Mockito.eq(136), Mockito.anyBoolean(), Mockito.any()))
                .thenReturn(fromLayer);

        Mockito.when(layerService.getLayer(Mockito.eq(532), Mockito.anyBoolean(), Mockito.any()))
                .thenReturn(toLayer);

        Mockito.when(contractService.linkObjects(
                Mockito.eq(fromLayer),
                Mockito.eq(12),
                Mockito.eq(toLayer),
                Mockito.eq(21)
        )).thenReturn(false);

        this.mockMvc.perform(post("/api/contract/link/136/12/532/21")
                .headers(this.getHeadersWithGroup("KSR_ROLE_ADMIN")))
                .andExpect(status().isOk());
    }

    @Test
    public void testUnLinkObjectsOk() throws Exception {
        Layer fromLayer = new Layer();
        fromLayer.setHasRelations(true);

        Layer toLayer = new Layer();
        toLayer.setHasRelations(true);

        Mockito.when(layerService.getLayer(Mockito.eq(136), Mockito.anyBoolean(), Mockito.any()))
                .thenReturn(fromLayer);

        Mockito.when(layerService.getLayer(Mockito.eq(532), Mockito.anyBoolean(), Mockito.any()))
                .thenReturn(toLayer);

        Mockito.doNothing()
                .when(contractService)
                .unlinkObjects(Mockito.eq(fromLayer), Mockito.eq(12),  Mockito.eq(toLayer), Mockito.eq(21));

        this.mockMvc.perform(post("/api/contract/unlink/136/12/532/21")
                .headers(this.getHeadersWithGroup("KSR_ROLE_ADMIN")))
                .andExpect(status().isOk());
    }

    @Test
    public void testUnLinkObjectsNoLayer1() throws Exception {
        Layer layer = new Layer();
        layer.setHasRelations(true);

        Mockito.when(layerService.getLayer(Mockito.eq(136), Mockito.anyBoolean(), Mockito.any()))
                .thenReturn(null);

        Mockito.when(layerService.getLayer(Mockito.eq(532), Mockito.anyBoolean(), Mockito.any()))
                .thenReturn(layer);

        this.mockMvc.perform(post("/api/contract/unlink/136/12/532/21")
                .headers(this.getHeadersWithGroup("KSR_ROLE_ADMIN")))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testUnLinkObjectsNoLayer2() throws Exception {
        Layer layer = new Layer();
        layer.setHasRelations(true);

        Mockito.when(layerService.getLayer(Mockito.eq(136), Mockito.anyBoolean(), Mockito.any()))
                .thenReturn(layer);

        Mockito.when(layerService.getLayer(Mockito.eq(532), Mockito.anyBoolean(), Mockito.any()))
                .thenReturn(null);

        this.mockMvc.perform(post("/api/contract/unlink/136/12/532/21")
                .headers(this.getHeadersWithGroup("KSR_ROLE_ADMIN")))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testUnLinkObjectsNoRelations() throws Exception {
        Layer fromLayer = new Layer();
        Layer toLayer = new Layer();

        Mockito.when(layerService.getLayer(Mockito.eq(136), Mockito.anyBoolean(), Mockito.any()))
                .thenReturn(fromLayer);

        Mockito.when(layerService.getLayer(Mockito.eq(532), Mockito.anyBoolean(), Mockito.any()))
                .thenReturn(toLayer);

        this.mockMvc.perform(post("/api/contract/unlink/136/12/532/21")
                .headers(this.getHeadersWithGroup("KSR_ROLE_ADMIN")))
                .andExpect(status().isNotFound());
    }
}
