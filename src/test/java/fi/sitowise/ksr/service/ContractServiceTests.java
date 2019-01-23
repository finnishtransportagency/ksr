package fi.sitowise.ksr.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import fi.sitowise.ksr.domain.Layer;
import fi.sitowise.ksr.domain.LayerAction;
import fi.sitowise.ksr.domain.LayerPermission;
import fi.sitowise.ksr.domain.contract.ContractLayer;
import fi.sitowise.ksr.domain.esri.Response;
import fi.sitowise.ksr.exceptions.KsrApiException;
import org.apache.http.HttpEntity;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.mockito.invocation.InvocationOnMock;
import org.mockito.stubbing.Answer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;

@RunWith(SpringRunner.class)
@SpringBootTest
public class ContractServiceTests {

    @MockBean
    HttpRequestService httpRequestService;

    @MockBean
    LayerService layerService;

    @Autowired
    private ContractService contractService;

    @Test(expected = KsrApiException.InternalServerErrorException.class)
    public void testLayerWithInvalidContractRelationType() {
        Layer layer = new Layer();
        layer.setRelationType("something else");

        contractService.getContracts(layer, 132);
    }

    @Test
    public void testSimpleRelation() throws IOException {
        Layer layer = new Layer();
        layer.setId(1L);
        layer.setRelationType("one");
        layer.setRelationColumnOut("C_ID");
        layer.setRelationColumnIn("ID_C");
        layer.setRelationLayerId(2L);
        layer.setUrl("http://test/ksr/1");
        layer.setUseInternalProxy("0");

        Layer targetLayer = new Layer();
        targetLayer.setId(2L);
        targetLayer.setUrl("http://test/ksr/2");
        targetLayer.setUseInternalProxy("0");

        Mockito.when(layerService.getLayer(
                Mockito.eq(2),
                Mockito.eq(true),
                Mockito.eq(LayerAction.READ_LAYER))
        ).thenReturn(targetLayer);

        InputStream is1 = new ByteArrayInputStream(("{" +
                "\"objectIdFieldName\":\"OBJECTID\"," +
                "\"globalIdFieldName\":\"\"," +
                "\"geometryType\":\"esriGeometryPolygon\"," +
                "\"spatialReference\":{" +
                "\"wkid\":102139," +
                "\"latestWkid\":3067}," +
                "\"fields\":[{" +
                "\"name\":\"C_ID\"," +
                "\"alias\":\"C_ID\"," +
                "\"type\":\"esriFieldTypeDouble\"}]," +
                "\"features\":[{" +
                "\"attributes\":{\"C_ID\":90}}]}").getBytes(StandardCharsets.UTF_8));

        InputStream is2 = new ByteArrayInputStream(("{" +
                "\"objectIdFieldName\":\"OBJECTID\"," +
                "\"globalIdFieldName\":\"\"," +
                "\"geometryType\":\"esriGeometryPolygon\"," +
                "\"spatialReference\":{" +
                "\"wkid\":102139," +
                "\"latestWkid\":3067}," +
                "\"fields\":[{" +
                "\"name\":\"C_ID\"," +
                "\"alias\":\"C_ID\"," +
                "\"type\":\"esriFieldTypeDouble\"}]," +
                "\"features\":[{" +
                "\"attributes\":{\"ID_C\":90}}]}").getBytes(StandardCharsets.UTF_8));

        InputStream is3 = new ByteArrayInputStream(("{" +
                "\"objectIdFieldName\":\"OBJECTID\"," +
                "\"globalIdFieldName\":\"\"," +
                "\"geometryType\":\"esriGeometryPolygon\"," +
                "\"spatialReference\":{" +
                "\"wkid\":102139," +
                "\"latestWkid\":3067}," +
                "\"fields\":[{" +
                "\"name\":\"C_ID\"," +
                "\"alias\":\"C_ID\"," +
                "\"type\":\"esriFieldTypeDouble\"}]," +
                "\"features\":[{" +
                "\"attributes\":{\"ID_C\":90}}]}").getBytes(StandardCharsets.UTF_8));


        String requestUrl1 = "http://test/ksr/1/query?f=pjson&returnGeometry=false&outFields=C_ID&objectIds=100";
        String requestUrl2 = "http://test/ksr/2/query?f=pjson&returnGeometry=false&outFields=*&where=ID_C+IN+%2890%29";

        Mockito.when(
                httpRequestService.getURLContents(Mockito.eq(requestUrl1), Mockito.eq(false), Mockito.isNull())
        ).thenReturn(is1);

        Mockito.when(
                httpRequestService.getURLContents(Mockito.eq(requestUrl2), Mockito.eq(false), Mockito.isNull())
        ).thenReturn(is2);

        ObjectMapper om = new ObjectMapper();
        Response expected = om.readValue(is3, Response.class);

        Assert.assertEquals(expected, contractService.getContracts(layer, 100));
    }

    @Test
    public void testSimpleRelationStringAttributes() throws IOException {
        Layer layer = new Layer();
        layer.setId(1L);
        layer.setRelationType("one");
        layer.setRelationColumnOut("C_ID");
        layer.setRelationColumnIn("ID_C");
        layer.setRelationLayerId(2L);
        layer.setUrl("http://test/ksr/1");
        layer.setUseInternalProxy("0");

        Layer targetLayer = new Layer();
        targetLayer.setId(2L);
        targetLayer.setUrl("http://test/ksr/2");
        targetLayer.setUseInternalProxy("0");

        Mockito.when(layerService.getLayer(
                Mockito.eq(2),
                Mockito.eq(true),
                Mockito.eq(LayerAction.READ_LAYER))
        ).thenReturn(targetLayer);

        InputStream is1 = new ByteArrayInputStream(("{" +
                "\"objectIdFieldName\":\"OBJECTID\"," +
                "\"globalIdFieldName\":\"\"," +
                "\"geometryType\":\"esriGeometryPolygon\"," +
                "\"spatialReference\":{" +
                "\"wkid\":102139," +
                "\"latestWkid\":3067}," +
                "\"fields\":[{" +
                "\"name\":\"C_ID\"," +
                "\"alias\":\"C_ID\"," +
                "\"type\":\"esriFieldTypeDouble\"}]," +
                "\"features\":[{" +
                "\"attributes\":{\"C_ID\":\"a90\"}}]}").getBytes(StandardCharsets.UTF_8));

        InputStream is2 = new ByteArrayInputStream(("{" +
                "\"objectIdFieldName\":\"OBJECTID\"," +
                "\"globalIdFieldName\":\"\"," +
                "\"geometryType\":\"esriGeometryPolygon\"," +
                "\"spatialReference\":{" +
                "\"wkid\":102139," +
                "\"latestWkid\":3067}," +
                "\"fields\":[{" +
                "\"name\":\"C_ID\"," +
                "\"alias\":\"C_ID\"," +
                "\"type\":\"esriFieldTypeDouble\"}]," +
                "\"features\":[{" +
                "\"attributes\":{\"ID_C\":\"a90\"}}]}").getBytes(StandardCharsets.UTF_8));

        InputStream is3 = new ByteArrayInputStream(("{" +
                "\"objectIdFieldName\":\"OBJECTID\"," +
                "\"globalIdFieldName\":\"\"," +
                "\"geometryType\":\"esriGeometryPolygon\"," +
                "\"spatialReference\":{" +
                "\"wkid\":102139," +
                "\"latestWkid\":3067}," +
                "\"fields\":[{" +
                "\"name\":\"C_ID\"," +
                "\"alias\":\"C_ID\"," +
                "\"type\":\"esriFieldTypeDouble\"}]," +
                "\"features\":[{" +
                "\"attributes\":{\"ID_C\":\"a90\"}}]}").getBytes(StandardCharsets.UTF_8));


        String requestUrl1 = "http://test/ksr/1/query?f=pjson&returnGeometry=false&outFields=C_ID&objectIds=100";
        String requestUrl2 = "http://test/ksr/2/query?f=pjson&returnGeometry=false&outFields=*&where=ID_C+IN+%28%27a90%27%29";

        Mockito.when(
                httpRequestService.getURLContents(Mockito.eq(requestUrl1), Mockito.eq(false), Mockito.isNull())
        ).thenReturn(is1);

        Mockito.when(
                httpRequestService.getURLContents(Mockito.eq(requestUrl2), Mockito.eq(false), Mockito.isNull())
        ).thenReturn(is2);

        ObjectMapper om = new ObjectMapper();
        Response expected = om.readValue(is3, Response.class);

        Assert.assertEquals(expected, contractService.getContracts(layer, 100));
    }

    @Test(expected = KsrApiException.ForbiddenException.class)
    public void testSimpleRelationNoTargetLayer() {
        Layer layer = new Layer();
        layer.setId(1L);
        layer.setRelationType("one");
        layer.setRelationColumnOut("C_ID");
        layer.setRelationLayerId(2L);
        layer.setUrl("http://test/ksr/1");
        layer.setUseInternalProxy("0");

        Mockito.when(layerService.getLayer(
                Mockito.eq(2),
                Mockito.eq(true),
                Mockito.eq(LayerAction.READ_LAYER))
        ).thenReturn(null);

        InputStream is1 = new ByteArrayInputStream(("{" +
                "\"objectIdFieldName\":\"OBJECTID\"," +
                "\"globalIdFieldName\":\"\"," +
                "\"geometryType\":\"esriGeometryPolygon\"," +
                "\"spatialReference\":{" +
                "\"wkid\":102139," +
                "\"latestWkid\":3067}," +
                "\"fields\":[{" +
                "\"name\":\"C_ID\"," +
                "\"alias\":\"C_ID\"," +
                "\"type\":\"esriFieldTypeDouble\"}]," +
                "\"features\":[{" +
                "\"attributes\":{\"C_ID\":90}}]}").getBytes(StandardCharsets.UTF_8));


        String requestUrl1 = "http://test/ksr/1/query?f=pjson&returnGeometry=false&outFields=C_ID&objectIds=100";

        Mockito.when(
                httpRequestService.getURLContents(Mockito.eq(requestUrl1), Mockito.eq(false), Mockito.isNull())
        ).thenReturn(is1);

        contractService.getContracts(layer, 100);
    }

    @Test(expected = KsrApiException.InternalServerErrorException.class)
    public void testSimpleRelationMalformedUrl() {
        Layer layer = new Layer();
        layer.setId(1L);
        layer.setRelationType("one");
        layer.setRelationColumnOut("C_ID");
        layer.setRelationLayerId(2L);
        layer.setUrl("*~/&%.,.,,...,");
        layer.setUseInternalProxy("0");

        contractService.getContracts(layer, 100);
    }

    @Test(expected = KsrApiException.InternalServerErrorException.class)
    public void testSimpleRelationInvalidServerResponse() {
        Layer layer = new Layer();
        layer.setId(1L);
        layer.setRelationType("one");
        layer.setRelationColumnOut("C_ID");
        layer.setRelationLayerId(2L);
        layer.setUrl("http://test/ksr/1");
        layer.setUseInternalProxy("0");

        Mockito.when(layerService.getLayer(
                Mockito.eq(2),
                Mockito.eq(true),
                Mockito.eq(LayerAction.READ_LAYER))
        ).thenReturn(null);

        InputStream is1 = new ByteArrayInputStream(("-").getBytes(StandardCharsets.UTF_8));


        String requestUrl1 = "http://test/ksr/1/query?f=pjson&returnGeometry=false&outFields=C_ID&objectIds=100";

        Mockito.when(
                httpRequestService.getURLContents(Mockito.eq(requestUrl1), Mockito.eq(false), Mockito.isNull())
        ).thenReturn(is1);

        contractService.getContracts(layer, 100);
    }

    @Test
    public void testManyRelation() throws IOException {
        Layer layer = new Layer();
        layer.setId(11L);
        layer.setRelationType("many");
        layer.setRelationColumnOut("C_ID");
        layer.setRelationColumnIn("C");
        layer.setRelationLayerId(12L);
        layer.setUrl("http://test/ksr/11");
        layer.setUseInternalProxy("0");

        Layer middleLayer = new Layer();
        middleLayer.setId(12L);
        middleLayer.setRelationType("one");
        middleLayer.setRelationColumnOut("CO");
        middleLayer.setRelationColumnIn("CO");
        middleLayer.setRelationLayerId(13L);
        middleLayer.setUrl("http://test/ksr/12");
        middleLayer.setUseInternalProxy("0");

        Layer targetLayer = new Layer();
        targetLayer.setId(13L);
        targetLayer.setUrl("http://test/ksr/13");
        targetLayer.setUseInternalProxy("0");

        Mockito.when(layerService.getLayer(
                Mockito.eq(12),
                Mockito.eq(true),
                Mockito.eq(LayerAction.READ_LAYER)
        )).thenReturn(middleLayer);

        Mockito.when(layerService.getLayer(
                Mockito.eq(13),
                Mockito.eq(true),
                Mockito.eq(LayerAction.READ_LAYER)
        )).thenReturn(targetLayer);

        InputStream is1 = new ByteArrayInputStream(("{" +
                "\"objectIdFieldName\":\"OBJECTID\"," +
                "\"globalIdFieldName\":\"\"," +
                "\"geometryType\":\"esriGeometryPolygon\"," +
                "\"spatialReference\":{" +
                "\"wkid\":102139," +
                "\"latestWkid\":3067}," +
                "\"fields\":[{" +
                "\"name\":\"C_ID\"," +
                "\"alias\":\"C_ID\"," +
                "\"type\":\"esriFieldTypeDouble\"}]," +
                "\"features\":[{" +
                "\"attributes\":{\"C_ID\":90}}]}").getBytes(StandardCharsets.UTF_8));

        InputStream is2 = new ByteArrayInputStream(("{" +
                "\"objectIdFieldName\":\"OBJECTID\"," +
                "\"globalIdFieldName\":\"\"," +
                "\"geometryType\":\"esriGeometryPolygon\"," +
                "\"spatialReference\":{" +
                "\"wkid\":102139," +
                "\"latestWkid\":3067}," +
                "\"fields\":[{" +
                "\"name\":\"C_ID\"," +
                "\"alias\":\"C_ID\"," +
                "\"type\":\"esriFieldTypeDouble\"}]," +
                "\"features\":[" +
                "{\"attributes\":{\"CO\":190, \"C\":90}}," +
                "{\"attributes\":{\"CO\":290, \"C\":90}}," +
                "{\"attributes\":{\"CO\":390, \"C\":90}}" +
                "]}").getBytes(StandardCharsets.UTF_8));

        InputStream is3 = new ByteArrayInputStream(("{" +
                "\"objectIdFieldName\":\"OBJECTID\"," +
                "\"globalIdFieldName\":\"\"," +
                "\"geometryType\":\"esriGeometryPolygon\"," +
                "\"spatialReference\":{" +
                "\"wkid\":102139," +
                "\"latestWkid\":3067}," +
                "\"fields\":[{" +
                "\"name\":\"C_ID\"," +
                "\"alias\":\"C_ID\"," +
                "\"type\":\"esriFieldTypeDouble\"}]," +
                "\"features\":[" +
                "{\"attributes\":{\"CO\":190, \"ID\":590}}," +
                "{\"attributes\":{\"CO\":190, \"ID\":690}}," +
                "{\"attributes\":{\"CO\":290, \"ID\":790}}," +
                "{\"attributes\":{\"CO\":290, \"ID\":890}}," +
                "{\"attributes\":{\"CO\":390, \"ID\":990}}" +
                "]}").getBytes(StandardCharsets.UTF_8));

        InputStream is4 = new ByteArrayInputStream(("{" +
                "\"objectIdFieldName\":\"OBJECTID\"," +
                "\"globalIdFieldName\":\"\"," +
                "\"geometryType\":\"esriGeometryPolygon\"," +
                "\"spatialReference\":{" +
                "\"wkid\":102139," +
                "\"latestWkid\":3067}," +
                "\"fields\":[{" +
                "\"name\":\"C_ID\"," +
                "\"alias\":\"C_ID\"," +
                "\"type\":\"esriFieldTypeDouble\"}]," +
                "\"features\":[" +
                "{\"attributes\":{\"CO\":190, \"ID\":590}}," +
                "{\"attributes\":{\"CO\":190, \"ID\":690}}," +
                "{\"attributes\":{\"CO\":290, \"ID\":790}}," +
                "{\"attributes\":{\"CO\":290, \"ID\":890}}," +
                "{\"attributes\":{\"CO\":390, \"ID\":990}}" +
                "]}").getBytes(StandardCharsets.UTF_8));

        String requestUrl1 = "http://test/ksr/11/query?f=pjson&returnGeometry=false&outFields=C_ID&objectIds=1000";
        String requestUrl2 = "http://test/ksr/12/query?f=pjson&returnGeometry=false&outFields=*&where=C+IN+%2890%29";
        String requestUrl3 = "http://test/ksr/13/query?f=pjson&returnGeometry=false&outFields=*&where=CO+IN+%28190%2C290%2C390%29";

        Mockito.when(
                httpRequestService.getURLContents(Mockito.eq(requestUrl1), Mockito.eq(false), Mockito.isNull())
        ).thenReturn(is1);

        Mockito.when(
                httpRequestService.getURLContents(Mockito.eq(requestUrl2), Mockito.eq(false), Mockito.isNull())
        ).thenReturn(is2);

        Mockito.when(
                httpRequestService.getURLContents(Mockito.eq(requestUrl3), Mockito.eq(false), Mockito.isNull())
        ).thenReturn(is3);


        ObjectMapper om = new ObjectMapper();
        Response expected = om.readValue(is4, Response.class);

        Assert.assertEquals(expected, contractService.getContracts(layer, 1000));
    }

    @Test
    public void testGetContractDetailsSimple() {
        Layer layer1 = new Layer();
        layer1.setType("agfs");
        layer1.setId(1L);
        layer1.setUrl("http://test/ksr/1");
        layer1.setUseInternalProxy("0");

        Layer layer2 = new Layer();
        layer2.setType("agfs");
        layer2.setId(2L);
        layer2.setUrl("http://test/ksr/2");
        layer2.setRelationColumnOut("RELATION_ID_1");
        layer2.setRelationColumnIn("RELATION_ID");
        layer2.setRelationType("one");
        layer2.setRelationLayerId(1L);
        layer2.setUseInternalProxy("0");

        InputStream is1 = new ByteArrayInputStream(("{\"feature\":{\"attributes\":{\"RELATION_ID\":90}}}").getBytes(StandardCharsets.UTF_8));

        InputStream is2 = new ByteArrayInputStream(("{" +
                "\"objectIdFieldName\":\"OBJECTID\"," +
                "\"globalIdFieldName\":\"\"," +
                "\"geometryType\":\"esriGeometryPolygon\"," +
                "\"spatialReference\":{" +
                "\"wkid\":102139," +
                "\"latestWkid\":3067}," +
                "\"fields\":[{" +
                "\"name\":\"RELATION_ID_1\"," +
                "\"alias\":\"RELATION_ID_1\"," +
                "\"type\":\"esriFieldTypeDouble\"}]," +
                "\"features\":[" +
                "{\"attributes\":{\"RELATION_ID_1\":90, \"C\":190}}" +
                "]}").getBytes(StandardCharsets.UTF_8));

        InputStream ise1 = new ByteArrayInputStream(("{" +
                "\"objectIdFieldName\":\"OBJECTID\"," +
                "\"globalIdFieldName\":\"\"," +
                "\"geometryType\":\"esriGeometryPolygon\"," +
                "\"spatialReference\":{" +
                "\"wkid\":102139," +
                "\"latestWkid\":3067}," +
                "\"fields\":[{" +
                "\"name\":\"RELATION_ID\"," +
                "\"alias\":\"RELATION_ID\"," +
                "\"type\":\"esriFieldTypeDouble\"}]," +
                "\"features\":[{" +
                "\"attributes\":{\"RELATION_ID\":90}}]}").getBytes(StandardCharsets.UTF_8));

        InputStream ise2 = new ByteArrayInputStream(("{" +
                "\"objectIdFieldName\":\"OBJECTID\"," +
                "\"globalIdFieldName\":\"\"," +
                "\"geometryType\":\"esriGeometryPolygon\"," +
                "\"spatialReference\":{" +
                "\"wkid\":102139," +
                "\"latestWkid\":3067}," +
                "\"fields\":[{" +
                "\"name\":\"RELATION_ID_1\"," +
                "\"alias\":\"RELATION_ID_1\"," +
                "\"type\":\"esriFieldTypeDouble\"}]," +
                "\"features\":[" +
                "{\"attributes\":{\"RELATION_ID_1\":90, \"C\":190}}" +
                "]}").getBytes(StandardCharsets.UTF_8));

        Mockito.when(
                layerService.getReferencingLayers(Mockito.eq("1"))
        ).thenReturn(Arrays.asList(layer2));

        Mockito.when(
                httpRequestService.getURLContents(
                        Mockito.eq("http://test/ksr/1/100?f=pjson"),
                        Mockito.eq(false),
                        Mockito.isNull()
                )
        ).thenReturn(is1);

        Mockito.when(
                httpRequestService.getURLContents(
                        Mockito.eq("http://test/ksr/2/query?f=pjson&returnGeometry=false&outFields=*&where=RELATION_ID_1+IN+%2890%29"),
                        Mockito.eq(false),
                        Mockito.isNull()
                )
        ).thenReturn(is2);


        ContractLayer cLayer1 = new ContractLayer(layer1, Response.fromInputStream(ise1, "1"));
        ContractLayer cLayer2 = new ContractLayer(layer2, Response.fromInputStream(ise2, "2"));

        List<ContractLayer> expected = Arrays.asList(cLayer1, cLayer2);
        List<ContractLayer> actual = contractService.getContractDetails(layer1, 100);

        Assert.assertEquals(expected, actual);
    }

    @Test
    public void testGetContractDetailsLink() {
        Layer layer1 = new Layer();
        layer1.setId(1L);
        layer1.setType("agfs");
        layer1.setUrl("http://test/ksr/1");
        layer1.setUseInternalProxy("0");

        Layer layer2 = new Layer();
        layer2.setId(2L);
        layer2.setType("agfl");
        layer2.setUrl("http://test/ksr/2");
        layer2.setRelationColumnOut("RELATION_ID_1");
        layer2.setRelationColumnIn("RELATION_ID");
        layer2.setRelationType("link");
        layer2.setRelationLayerId(1L);
        layer2.setUseInternalProxy("0");

        Layer layer3 = new Layer();
        layer3.setId(3L);
        layer2.setType("agfs");
        layer3.setUrl("http://test/ksr/3");
        layer3.setRelationColumnOut("R_ID_2");
        layer3.setRelationColumnIn("R_ID");
        layer3.setRelationType("many");
        layer3.setRelationLayerId(2L);
        layer3.setUseInternalProxy("0");

        InputStream is1 = new ByteArrayInputStream(("{\"feature\":{\"attributes\":{\"RELATION_ID\":90}}}").getBytes(StandardCharsets.UTF_8));

        InputStream is2 = new ByteArrayInputStream(("{" +
                "\"objectIdFieldName\":\"OBJECTID\"," +
                "\"globalIdFieldName\":\"\"," +
                "\"geometryType\":\"esriGeometryPolygon\"," +
                "\"spatialReference\":{" +
                "\"wkid\":102139," +
                "\"latestWkid\":3067}," +
                "\"fields\":[{" +
                "\"name\":\"RELATION_ID_1\"," +
                "\"alias\":\"RELATION_ID_1\"," +
                "\"type\":\"esriFieldTypeDouble\"}]," +
                "\"features\":[" +
                "{\"attributes\":{\"RELATION_ID_1\":90, \"R_ID\":190}}" +
                "]}").getBytes(StandardCharsets.UTF_8));

        InputStream is3 = new ByteArrayInputStream(("{" +
                "\"objectIdFieldName\":\"OBJECTID\"," +
                "\"globalIdFieldName\":\"\"," +
                "\"geometryType\":\"esriGeometryPolygon\"," +
                "\"spatialReference\":{" +
                "\"wkid\":102139," +
                "\"latestWkid\":3067}," +
                "\"fields\":[{" +
                "\"name\":\"R_ID_2\"," +
                "\"alias\":\"R_ID_2\"," +
                "\"type\":\"esriFieldTypeDouble\"}]," +
                "\"features\":[" +
                "{\"attributes\":{\"R_ID_2\":190}}" +
                "]}").getBytes(StandardCharsets.UTF_8));

        InputStream ise1 = new ByteArrayInputStream(("{" +
                "\"objectIdFieldName\":\"OBJECTID\"," +
                "\"globalIdFieldName\":\"\"," +
                "\"geometryType\":\"esriGeometryPolygon\"," +
                "\"spatialReference\":{" +
                "\"wkid\":102139," +
                "\"latestWkid\":3067}," +
                "\"fields\":[{" +
                "\"name\":\"RELATION_ID\"," +
                "\"alias\":\"RELATION_ID\"," +
                "\"type\":\"esriFieldTypeDouble\"}]," +
                "\"features\":[{" +
                "\"attributes\":{\"RELATION_ID\":90}}]}").getBytes(StandardCharsets.UTF_8));

        Mockito.when(
            layerService.getReferencingLayers(Mockito.eq("1"))
        ).thenReturn(Arrays.asList(layer2));

        Mockito.when(
            layerService.getReferencingLayers(Mockito.eq("2"))
        ).thenReturn(Arrays.asList(layer3));

        Mockito.when(
                httpRequestService.getURLContents(
                        Mockito.eq("http://test/ksr/1/100?f=pjson"),
                        Mockito.eq(false),
                        Mockito.isNull()
                )
        ).thenReturn(is1);

        Mockito.when(
                httpRequestService.getURLContents(
                        Mockito.eq("http://test/ksr/2/query?f=pjson&returnGeometry=false&outFields=*&where=RELATION_ID_1+IN+%2890%29"),
                        Mockito.eq(false),
                        Mockito.isNull()
                )
        ).thenReturn(is2);

        Mockito.when(
                httpRequestService.getURLContents(
                        Mockito.eq("http://test/ksr/3/query?f=pjson&returnGeometry=false&outFields=*&where=R_ID_2+IN+%28190%29"),
                        Mockito.eq(false),
                        Mockito.isNull()
                )
        ).thenReturn(is3);


        ContractLayer cLayer1 = new ContractLayer(layer1, Response.fromInputStream(ise1, "1"));

        List<ContractLayer> expected = Arrays.asList(cLayer1);
        List<ContractLayer> actual = contractService.getContractDetails(layer1, 100);

        Assert.assertEquals(expected, actual);
    }

    @Test(expected = KsrApiException.NotFoundErrorException.class)
    public void testGetRelatingLayerNullLayer() {
        contractService.getRelatingLayer(null);
    }

    @Test(expected = KsrApiException.NotFoundErrorException.class)
    public void testGetRelatingLayerNoRelationType() {
        contractService.getRelatingLayer(new Layer());
    }

    @Test
    public void testGetRelatingLayerRelationOne() {
        Layer layer = new Layer();
        layer.setId(1L);
        layer.setRelationLayerId(2L);
        layer.setRelationType("one");

        Layer layer2 = new Layer();
        layer2.setId(2L);

        Mockito.when(layerService.getLayer(
                Mockito.eq(2),
                Mockito.eq(true),
                Mockito.eq(LayerAction.READ_LAYER)
        )).thenReturn(layer2);

        Assert.assertEquals(layer2, contractService.getRelatingLayer(layer));
    }

    @Test
    public void testGetRelatingLayerRelationLink() {
        Layer layer = new Layer();
        layer.setId(1L);
        layer.setRelationLayerId(2L);
        layer.setRelationType("link");

        Layer layer2 = new Layer();
        layer2.setId(2L);

        Mockito.when(layerService.getLayer(
                Mockito.eq(2),
                Mockito.eq(true),
                Mockito.eq(LayerAction.READ_LAYER)
        )).thenReturn(layer2);

        Assert.assertEquals(layer2, contractService.getRelatingLayer(layer));
    }

    @Test
    public void testGetRelatingLayerRelationMany() {
        Layer layer = new Layer();
        layer.setId(1L);
        layer.setRelationLayerId(2L);
        layer.setRelationType("many");

        Layer middleLayer = new Layer();
        middleLayer.setId(2L);
        middleLayer.setRelationLayerId(3L);
        middleLayer.setRelationType("link");

        Layer targetLayer = new Layer();
        targetLayer.setRelationLayerId(3L);

        Mockito.when(layerService.getLayer(
                Mockito.eq(2),
                Mockito.eq(true),
                Mockito.eq(LayerAction.READ_LAYER)
        )).thenReturn(middleLayer);

        Mockito.when(layerService.getLayer(
                Mockito.eq(3),
                Mockito.eq(true),
                Mockito.eq(LayerAction.READ_LAYER)
        )).thenReturn(targetLayer);

        Assert.assertEquals(targetLayer, contractService.getRelatingLayer(layer));
    }

    @Test
    public void testLinkObjectsSimple() {
        Layer fromLayer = new Layer();
        fromLayer.setId(1L);
        fromLayer.setType("agfs");
        fromLayer.setUrl("http://from.layer/1");
        fromLayer.setRelationType("one");
        fromLayer.setRelationLayerId(2L);
        fromLayer.setRelationColumnOut("COLUMN_OUT");
        fromLayer.setRelationColumnIn("COLUMN_IN");

        LayerPermission permission = new LayerPermission();
        permission.setUpdateLayer("1");
        fromLayer.setLayerPermission(permission);

        Layer toLayer = new Layer();
        toLayer.setId(2L);
        toLayer.setUrl("http://to.layer/2");
        toLayer.setType("agfs");


        InputStream is2 = new ByteArrayInputStream("{\"feature\":{\"attributes\":{\"COLUMN_IN\": 200}}}".getBytes(StandardCharsets.UTF_8));
        InputStream is3 = new ByteArrayInputStream("{\"addResults\":[],\"updateResults\":[{\"objectId\":1,\"success\":true}],\"deleteResults\":[]}".getBytes(StandardCharsets.UTF_8));
        InputStream is4 = new ByteArrayInputStream("{\"objectIdField\": \"OBJECTID\"}".getBytes(StandardCharsets.UTF_8));

        Mockito.when(httpRequestService.getURLContents(
                Mockito.eq("http://to.layer/2/200?f=pjson"),
                Mockito.eq(false),
                Mockito.isNull()
        )).thenReturn(is2);

        Mockito.when(httpRequestService.postURLContents(
                Mockito.eq("http://from.layer/1/applyEdits"),
                Mockito.any(HttpEntity.class),
                Mockito.isNull(),
                Mockito.anyString(),
                Mockito.anyBoolean()
        )).thenReturn(is3);

        Mockito.when(httpRequestService.getURLContents(
                Mockito.eq("http://from.layer/1?f=pjson"),
                Mockito.eq(false),
                Mockito.isNull()
        )).thenReturn(is4);

        Assert.assertFalse(contractService.linkObjects(fromLayer, 123, toLayer, 200));
    }

    @Test
    public void testLinkObjectsManyExisting() {
        Layer fromLayer = new Layer();
        fromLayer.setId(1L);
        fromLayer.setType("agfs");
        fromLayer.setUrl("http://from.layer/1");
        fromLayer.setRelationType("many");
        fromLayer.setRelationLayerId(2L);
        fromLayer.setRelationColumnOut("FROM_OUT");
        fromLayer.setRelationColumnIn("MIDDLE_IN");

        LayerPermission fromPermission = new LayerPermission();
        fromPermission.setUpdateLayer("1");
        fromPermission.setReadLayer("1");
        fromLayer.setLayerPermission(fromPermission);

        Layer middleLayer = new Layer();
        middleLayer.setId(2L);
        middleLayer.setType("agfl");
        middleLayer.setUrl("http://middle.layer/2");
        middleLayer.setRelationType("link");
        middleLayer.setRelationLayerId(3L);
        middleLayer.setRelationColumnOut("MIDDLE_OUT");
        middleLayer.setRelationColumnIn("TO_IN");

        LayerPermission middlePermission = new LayerPermission();
        middlePermission.setUpdateLayer("1");
        middlePermission.setReadLayer("1");
        middleLayer.setLayerPermission(middlePermission);

        Layer toLayer = new Layer();
        toLayer.setId(3L);
        toLayer.setUrl("http://to.layer/3");
        toLayer.setType("agfs");


        InputStream is1 = new ByteArrayInputStream("{\"feature\":{\"attributes\":{\"FROM_OUT\": 200}}}".getBytes(StandardCharsets.UTF_8));
        InputStream is2 = new ByteArrayInputStream("{\"feature\":{\"attributes\":{\"TO_IN\": 200}}}".getBytes(StandardCharsets.UTF_8));
        InputStream is3 = new ByteArrayInputStream("{\"addResults\":[{\"objectId\":1,\"success\":true}],\"updateResults\":[],\"deleteResults\":[]}".getBytes(StandardCharsets.UTF_8));
        InputStream is4 = new ByteArrayInputStream("{\"objectIdFieldName\":\"OBJECTID\",\"globalIdFieldName\":\"\",\"geometryType\":\"esriGeometryPolygon\",\"spatialReference\":{\"wkid\":102139,\"latestWkid\":3067},\"fields\":[],\"features\":[{\"attributes\": {\"MIDDLE_IN\":200,\"MIDDLE_OUT\":200}}]}".getBytes(StandardCharsets.UTF_8));

        Mockito.when(httpRequestService.getURLContents(
                Mockito.eq("http://from.layer/1/123?f=pjson"),
                Mockito.eq(false),
                Mockito.isNull()
        )).thenReturn(is1);

        Mockito.when(httpRequestService.getURLContents(
                Mockito.eq("http://to.layer/3/200?f=pjson"),
                Mockito.eq(false),
                Mockito.isNull()
        )).thenReturn(is2);

        Mockito.when(httpRequestService.getURLContents(
                Mockito.eq("http://middle.layer/2/query?f=pjson&returnGeometry=false&outFields=*&where=MIDDLE_IN+IN+%28200%29"),
                Mockito.eq(false),
                Mockito.isNull()
        )).thenReturn(is4);

        Mockito.when(layerService.getLayer(
                Mockito.eq(2),
                Mockito.anyBoolean(),
                Mockito.eq(LayerAction.READ_LAYER)
        )).thenReturn(middleLayer);

        Mockito.when(httpRequestService.postURLContents(
                Mockito.eq("http://middle.layer/2/applyEdits"),
                Mockito.any(HttpEntity.class),
                Mockito.isNull(),
                Mockito.anyString(),
                Mockito.anyBoolean()
        )).thenReturn(is3);

        Assert.assertFalse(contractService.linkObjects(fromLayer, 123, toLayer, 200));
    }

    @Test
    public void testLinkObjectsManyNonExisting() {
        Layer fromLayer = new Layer();
        fromLayer.setId(1L);
        fromLayer.setType("agfs");
        fromLayer.setUrl("http://from.layer/1");
        fromLayer.setRelationType("many");
        fromLayer.setRelationLayerId(2L);
        fromLayer.setRelationColumnOut("FROM_OUT");
        fromLayer.setRelationColumnIn("MIDDLE_IN");

        LayerPermission fromPermission = new LayerPermission();
        fromPermission.setUpdateLayer("1");
        fromPermission.setReadLayer("1");
        fromLayer.setLayerPermission(fromPermission);

        Layer middleLayer = new Layer();
        middleLayer.setId(2L);
        middleLayer.setType("agfl");
        middleLayer.setUrl("http://middle.layer/2");
        middleLayer.setRelationType("link");
        middleLayer.setRelationLayerId(3L);
        middleLayer.setRelationColumnOut("MIDDLE_OUT");
        middleLayer.setRelationColumnIn("TO_IN");

        LayerPermission middlePermission = new LayerPermission();
        middlePermission.setUpdateLayer("1");
        middlePermission.setReadLayer("1");
        middleLayer.setLayerPermission(middlePermission);

        Layer toLayer = new Layer();
        toLayer.setId(3L);
        toLayer.setUrl("http://to.layer/3");
        toLayer.setType("agfs");


        InputStream is1 = new ByteArrayInputStream("{\"feature\":{\"attributes\":{\"FROM_OUT\": 200}}}".getBytes(StandardCharsets.UTF_8));
        InputStream is2 = new ByteArrayInputStream("{\"feature\":{\"attributes\":{\"TO_IN\": 200}}}".getBytes(StandardCharsets.UTF_8));
        InputStream is3 = new ByteArrayInputStream("{\"addResults\":[{\"objectId\":1,\"success\":true}],\"updateResults\":[],\"deleteResults\":[]}".getBytes(StandardCharsets.UTF_8));
        InputStream is4 = new ByteArrayInputStream("{\"objectIdFieldName\":\"OBJECTID\",\"globalIdFieldName\":\"\",\"geometryType\":\"esriGeometryPolygon\",\"spatialReference\":{\"wkid\":102139,\"latestWkid\":3067},\"fields\":[],\"features\":[]}".getBytes(StandardCharsets.UTF_8));

        Mockito.when(httpRequestService.getURLContents(
                Mockito.eq("http://from.layer/1/123?f=pjson"),
                Mockito.eq(false),
                Mockito.isNull()
        )).thenReturn(is1);

        Mockito.when(httpRequestService.getURLContents(
                Mockito.eq("http://to.layer/3/200?f=pjson"),
                Mockito.eq(false),
                Mockito.isNull()
        )).thenReturn(is2);

        Mockito.when(httpRequestService.getURLContents(
                Mockito.eq("http://middle.layer/2/query?f=pjson&returnGeometry=false&outFields=*&where=MIDDLE_IN+IN+%28200%29"),
                Mockito.eq(false),
                Mockito.isNull()
        )).thenReturn(is4);

        Mockito.when(layerService.getLayer(
                Mockito.eq(2),
                Mockito.anyBoolean(),
                Mockito.eq(LayerAction.READ_LAYER)
        )).thenReturn(middleLayer);

        Mockito.when(httpRequestService.postURLContents(
                Mockito.eq("http://middle.layer/2/applyEdits"),
                Mockito.any(HttpEntity.class),
                Mockito.isNull(),
                Mockito.anyString(),
                Mockito.anyBoolean()
        )).thenReturn(is3);

        Assert.assertTrue(contractService.linkObjects(fromLayer, 123, toLayer, 200));
    }

    @Test(expected = KsrApiException.ForbiddenException.class)
    @WithMockUser(username = "test_user")
    public void testLinkObjectsManyNoLinkPermission() {
        Layer fromLayer = new Layer();
        fromLayer.setId(1L);
        fromLayer.setType("agfs");
        fromLayer.setUrl("http://from.layer/1");
        fromLayer.setRelationType("many");
        fromLayer.setRelationLayerId(2L);
        fromLayer.setRelationColumnOut("FROM_OUT");
        fromLayer.setRelationColumnIn("MIDDLE_IN");

        LayerPermission fromPermission = new LayerPermission();
        fromPermission.setReadLayer("1");
        fromLayer.setLayerPermission(fromPermission);

        Layer middleLayer = new Layer();
        middleLayer.setId(2L);
        middleLayer.setType("agfl");
        middleLayer.setUrl("http://middle.layer/2");
        middleLayer.setRelationType("link");
        middleLayer.setRelationLayerId(3L);
        middleLayer.setRelationColumnOut("MIDDLE_OUT");
        middleLayer.setRelationColumnIn("TO_IN");

        LayerPermission middlePermission = new LayerPermission();
        middlePermission.setReadLayer("1");
        middleLayer.setLayerPermission(middlePermission);

        Layer toLayer = new Layer();
        toLayer.setId(3L);
        toLayer.setUrl("http://to.layer/3");
        toLayer.setType("agfs");


        InputStream is1 = new ByteArrayInputStream("{\"feature\":{\"attributes\":{\"FROM_OUT\": 200}}}".getBytes(StandardCharsets.UTF_8));
        InputStream is2 = new ByteArrayInputStream("{\"feature\":{\"attributes\":{\"COLUMN_IN\": 200}}}".getBytes(StandardCharsets.UTF_8));

        Mockito.when(httpRequestService.getURLContents(
                Mockito.eq("http://from.layer/1/123?f=pjson"),
                Mockito.eq(false),
                Mockito.isNull()
        )).thenReturn(is1);

        Mockito.when(httpRequestService.getURLContents(
                Mockito.eq("http://to.layer/3/200?f=pjson"),
                Mockito.eq(false),
                Mockito.isNull()
        )).thenReturn(is2);

        Mockito.when(layerService.getLayer(
                Mockito.eq(2),
                Mockito.anyBoolean(),
                Mockito.eq(LayerAction.READ_LAYER)
        )).thenReturn(middleLayer);

        contractService.linkObjects(fromLayer, 123, toLayer, 200);
    }

    @Test
    public void testUnLinkObjectsMany() {
        Layer fromLayer = new Layer();
        fromLayer.setId(1L);
        fromLayer.setType("agfs");
        fromLayer.setUrl("http://from.layer/1");
        fromLayer.setRelationType("many");
        fromLayer.setRelationLayerId(2L);
        fromLayer.setRelationColumnOut("FROM_OUT");
        fromLayer.setRelationColumnIn("MIDDLE_IN");

        LayerPermission fromPermission = new LayerPermission();
        fromPermission.setUpdateLayer("1");
        fromPermission.setReadLayer("1");
        fromLayer.setLayerPermission(fromPermission);

        Layer middleLayer = new Layer();
        middleLayer.setId(2L);
        middleLayer.setType("agfl");
        middleLayer.setUrl("http://middle.layer/2");
        middleLayer.setRelationType("link");
        middleLayer.setRelationLayerId(3L);
        middleLayer.setRelationColumnOut("MIDDLE_OUT");
        middleLayer.setRelationColumnIn("TO_IN");

        LayerPermission middlePermission = new LayerPermission();
        middlePermission.setUpdateLayer("1");
        middlePermission.setReadLayer("1");
        middleLayer.setLayerPermission(middlePermission);

        Layer toLayer = new Layer();
        toLayer.setId(3L);
        toLayer.setUrl("http://to.layer/3");
        toLayer.setType("agfs");


        InputStream is1 = new ByteArrayInputStream("{\"feature\":{\"attributes\":{\"FROM_OUT\": 200}}}".getBytes(StandardCharsets.UTF_8));
        InputStream is2 = new ByteArrayInputStream("{\"feature\":{\"attributes\":{\"TO_IN\": 200}}}".getBytes(StandardCharsets.UTF_8));
        InputStream is3 = new ByteArrayInputStream("{\"addResults\":[],\"updateResults\":[],\"deleteResults\":[{\"objectId\":1,\"success\":true}]}".getBytes(StandardCharsets.UTF_8));

        Mockito.when(httpRequestService.getURLContents(
                Mockito.eq("http://from.layer/1/123?f=pjson"),
                Mockito.eq(false),
                Mockito.isNull()
        )).thenReturn(is1);

        Mockito.when(httpRequestService.getURLContents(
                Mockito.eq("http://to.layer/3/200?f=pjson"),
                Mockito.eq(false),
                Mockito.isNull()
        )).thenReturn(is2);

        Mockito.when(httpRequestService.getURLContents(
                Mockito.eq("http://middle.layer/2/query?f=pjson&returnGeometry=false&outFields=*&where=MIDDLE_IN+IN+%28200%29"),
                Mockito.eq(false),
                Mockito.isNull()
        )).thenAnswer(new Answer<InputStream>() {
            // Cannot use thenReturn because this mock will be invoked multiple times during execution,
            // and therefore a new InputStream is necessary.
            public InputStream answer(InvocationOnMock invocation) {
                return new ByteArrayInputStream("{\"objectIdFieldName\":\"OBJECTID\",\"globalIdFieldName\":\"\",\"geometryType\":\"esriGeometryPolygon\",\"spatialReference\":{\"wkid\":102139,\"latestWkid\":3067},\"fields\":[],\"features\":[{\"attributes\": {\"OBJECTID\":1,\"MIDDLE_IN\":200,\"MIDDLE_OUT\":200}}]}".getBytes(StandardCharsets.UTF_8));
            }
        });

        Mockito.when(layerService.getLayer(
                Mockito.eq(2),
                Mockito.anyBoolean(),
                Mockito.eq(LayerAction.READ_LAYER)
        )).thenReturn(middleLayer);

        Mockito.when(httpRequestService.postURLContents(
                Mockito.eq("http://middle.layer/2/deleteFeatures"),
                Mockito.any(HttpEntity.class),
                Mockito.isNull(),
                Mockito.anyString(),
                Mockito.anyBoolean()
        )).thenReturn(is3);

        contractService.unlinkObjects(fromLayer, 123, toLayer, 200);
    }

    @Test(expected = KsrApiException.ForbiddenException.class)
    @WithMockUser(username = "test_user")
    public void testUnLinkObjectsManyNoPermission() {
        Layer fromLayer = new Layer();
        fromLayer.setId(1L);
        fromLayer.setType("agfs");
        fromLayer.setUrl("http://from.layer/1");
        fromLayer.setRelationType("many");
        fromLayer.setRelationLayerId(2L);
        fromLayer.setRelationColumnOut("FROM_OUT");
        fromLayer.setRelationColumnIn("MIDDLE_IN");

        LayerPermission fromPermission = new LayerPermission();
        fromPermission.setReadLayer("1");
        fromLayer.setLayerPermission(fromPermission);

        Layer middleLayer = new Layer();
        middleLayer.setId(2L);
        middleLayer.setType("agfl");
        middleLayer.setUrl("http://middle.layer/2");
        middleLayer.setRelationType("link");
        middleLayer.setRelationLayerId(3L);
        middleLayer.setRelationColumnOut("MIDDLE_OUT");
        middleLayer.setRelationColumnIn("TO_IN");

        LayerPermission middlePermission = new LayerPermission();
        middlePermission.setReadLayer("1");
        middleLayer.setLayerPermission(middlePermission);

        Layer toLayer = new Layer();
        toLayer.setId(3L);
        toLayer.setUrl("http://to.layer/3");
        toLayer.setType("agfs");


        InputStream is1 = new ByteArrayInputStream("{\"feature\":{\"attributes\":{\"FROM_OUT\": 200}}}".getBytes(StandardCharsets.UTF_8));
        InputStream is2 = new ByteArrayInputStream("{\"feature\":{\"attributes\":{\"TO_IN\": 200}}}".getBytes(StandardCharsets.UTF_8));
        InputStream is3 = new ByteArrayInputStream("{\"addResults\":[],\"updateResults\":[],\"deleteResults\":[{\"objectId\":1,\"success\":true}]}".getBytes(StandardCharsets.UTF_8));

        Mockito.when(httpRequestService.getURLContents(
                Mockito.eq("http://from.layer/1/123?f=pjson"),
                Mockito.eq(false),
                Mockito.isNull()
        )).thenReturn(is1);

        Mockito.when(httpRequestService.getURLContents(
                Mockito.eq("http://to.layer/3/200?f=pjson"),
                Mockito.eq(false),
                Mockito.isNull()
        )).thenReturn(is2);

        Mockito.when(httpRequestService.getURLContents(
                Mockito.eq("http://middle.layer/2/query?f=pjson&returnGeometry=false&outFields=*&where=MIDDLE_IN+IN+%28200%29"),
                Mockito.eq(false),
                Mockito.isNull()
        )).thenAnswer(new Answer<InputStream>() {
            // Cannot use thenReturn because this mock will be invoked multiple times during execution,
            // and therefore a new InputStream is necessary.
            public InputStream answer(InvocationOnMock invocation) {
                return new ByteArrayInputStream("{\"objectIdFieldName\":\"OBJECTID\",\"globalIdFieldName\":\"\",\"geometryType\":\"esriGeometryPolygon\",\"spatialReference\":{\"wkid\":102139,\"latestWkid\":3067},\"fields\":[],\"features\":[{\"attributes\": {\"OBJECTID\":1,\"MIDDLE_IN\":200,\"MIDDLE_OUT\":200}}]}".getBytes(StandardCharsets.UTF_8));
            }
        });

        Mockito.when(layerService.getLayer(
                Mockito.eq(2),
                Mockito.anyBoolean(),
                Mockito.eq(LayerAction.READ_LAYER)
        )).thenReturn(middleLayer);

        Mockito.when(httpRequestService.postURLContents(
                Mockito.eq("http://middle.layer/2/deleteFeatures"),
                Mockito.any(HttpEntity.class),
                Mockito.isNull(),
                Mockito.anyString(),
                Mockito.anyBoolean()
        )).thenReturn(is3);

        contractService.unlinkObjects(fromLayer, 123, toLayer, 200);
    }

    @Test
    public void testUnLinkObjectsSimple() {
        Layer fromLayer = new Layer();
        fromLayer.setId(1L);
        fromLayer.setType("agfs");
        fromLayer.setUrl("http://from.layer/1");
        fromLayer.setRelationType("one");
        fromLayer.setRelationLayerId(2L);
        fromLayer.setRelationColumnOut("COLUMN_OUT");
        fromLayer.setRelationColumnIn("COLUMN_IN");

        LayerPermission permission = new LayerPermission();
        permission.setUpdateLayer("1");
        fromLayer.setLayerPermission(permission);

        Layer toLayer = new Layer();
        toLayer.setId(2L);
        toLayer.setUrl("http://to.layer/2");
        toLayer.setType("agfs");


        InputStream is2 = new ByteArrayInputStream("{\"feature\":{\"attributes\":{\"COLUMN_IN\": 200}}}".getBytes(StandardCharsets.UTF_8));
        InputStream is3 = new ByteArrayInputStream("{\"addResults\":[],\"updateResults\":[{\"objectId\":1,\"success\":true}],\"deleteResults\":[]}".getBytes(StandardCharsets.UTF_8));
        InputStream is4 = new ByteArrayInputStream("{\"objectIdField\": \"OBJECTID\"}".getBytes(StandardCharsets.UTF_8));

        Mockito.when(httpRequestService.getURLContents(
                Mockito.eq("http://to.layer/2/200?f=pjson"),
                Mockito.eq(false),
                Mockito.isNull()
        )).thenReturn(is2);

        Mockito.when(httpRequestService.postURLContents(
                Mockito.eq("http://from.layer/1/applyEdits"),
                Mockito.any(HttpEntity.class),
                Mockito.isNull(),
                Mockito.anyString(),
                Mockito.anyBoolean()
        )).thenReturn(is3);

        Mockito.when(httpRequestService.getURLContents(
                Mockito.eq("http://from.layer/1?f=pjson"),
                Mockito.eq(false),
                Mockito.isNull()
        )).thenReturn(is4);

        contractService.unlinkObjects(fromLayer, 123, toLayer, 200);
    }

    @Test(expected = KsrApiException.ForbiddenException.class)
    @WithMockUser(username = "test_user")
    public void testUnLinkObjectsSimpleNoPermission() {
        Layer fromLayer = new Layer();
        fromLayer.setId(1L);
        fromLayer.setType("agfs");
        fromLayer.setUrl("http://from.layer/1");
        fromLayer.setRelationType("one");
        fromLayer.setRelationLayerId(2L);
        fromLayer.setRelationColumnOut("COLUMN_OUT");
        fromLayer.setRelationColumnIn("COLUMN_IN");

        LayerPermission permission = new LayerPermission();
        permission.setReadLayer("1");
        fromLayer.setLayerPermission(permission);

        Layer toLayer = new Layer();
        toLayer.setId(2L);
        toLayer.setUrl("http://to.layer/2");
        toLayer.setType("agfs");


        InputStream is2 = new ByteArrayInputStream("{\"feature\":{\"attributes\":{\"COLUMN_IN\": 200}}}".getBytes(StandardCharsets.UTF_8));
        InputStream is3 = new ByteArrayInputStream("{\"addResults\":[],\"updateResults\":[{\"objectId\":1,\"success\":true}],\"deleteResults\":[]}".getBytes(StandardCharsets.UTF_8));
        InputStream is4 = new ByteArrayInputStream("{\"objectIdField\": \"OBJECTID\"}".getBytes(StandardCharsets.UTF_8));

        Mockito.when(httpRequestService.getURLContents(
                Mockito.eq("http://to.layer/2/200?f=pjson"),
                Mockito.eq(false),
                Mockito.isNull()
        )).thenReturn(is2);

        Mockito.when(httpRequestService.postURLContents(
                Mockito.eq("http://from.layer/1/applyEdits"),
                Mockito.any(HttpEntity.class),
                Mockito.isNull(),
                Mockito.anyString(),
                Mockito.anyBoolean()
        )).thenReturn(is3);

        Mockito.when(httpRequestService.getURLContents(
                Mockito.eq("http://from.layer/1?f=pjson"),
                Mockito.eq(false),
                Mockito.isNull()
        )).thenReturn(is4);

        contractService.unlinkObjects(fromLayer, 123, toLayer, 200);
    }

}
