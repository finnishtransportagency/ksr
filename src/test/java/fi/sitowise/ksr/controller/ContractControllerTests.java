package fi.sitowise.ksr.controller;

import fi.sitowise.ksr.domain.Layer;
import fi.sitowise.ksr.domain.LayerAction;
import fi.sitowise.ksr.domain.proxy.EsriQueryResponse;
import fi.sitowise.ksr.exceptions.KsrApiException;
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

import java.util.Collections;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
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

        EsriQueryResponse eqr = new EsriQueryResponse();
        eqr.setObjectIdFieldName("OBJECTID");
        eqr.setGlobalIdFieldName("UUID");

        Mockito.when(layerService.getLayer(Mockito.eq(457), Mockito.anyBoolean(), Mockito.any(LayerAction.class)))
                .thenReturn(layer);

        Mockito.when(contractService.getContracts(Mockito.any(), Mockito.eq(123)))
                .thenReturn(eqr);

        this.mockMvc.perform(get("/api/contract/457/123")
                .headers(this.getHeadersWithGroup("KSR_ROLE_ADMIN")))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json;charset=utf-8"))
                .andExpect(content().json(
                        "{" +
                                "\"objectIdFieldName\": \"OBJECTID\"" +
                                ",\"globalIdFieldName\": \"UUID\""+
                                ",\"fields\": null"+
                                ",\"features\": null"+
                                "}"));
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
}
