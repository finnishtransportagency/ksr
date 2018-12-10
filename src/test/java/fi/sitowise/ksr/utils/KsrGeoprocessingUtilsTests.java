package fi.sitowise.ksr.utils;

import fi.sitowise.ksr.domain.Layer;
import fi.sitowise.ksr.domain.LayerAction;
import fi.sitowise.ksr.repository.LayerRepository;
import fi.sitowise.ksr.repository.UserLayerRepository;
import fi.sitowise.ksr.service.LayerGroupService;
import fi.sitowise.ksr.service.LayerService;
import org.apache.http.NameValuePair;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.json.simple.parser.ParseException;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.ArrayList;
import java.util.List;

/**
 * Print utility tests.
 */
@RunWith(SpringRunner.class)
@WebMvcTest(value = SpringRunner.class)
@ContextConfiguration(classes = LayerService.class)
public class KsrGeoprocessingUtilsTests {

    @MockBean
    CloseableHttpClient closeableHttpClient;

    @MockBean
    RequestConfig requestConfig;

    @Autowired
    private LayerService layerService;

    /**
     * The Layer repository.
     */
    @MockBean
    LayerRepository layerRepository;

    /**
     * The User Layer repository.
     */
    @MockBean
    UserLayerRepository userLayerRepository;

    /**
     * The Layer group service.
     */
    @MockBean
    LayerGroupService layerGroupService;

    @Test
    public void testCreatePrintParameters() throws ParseException {
        List<NameValuePair> params = new ArrayList<>();
        MockHttpServletRequest request = new MockHttpServletRequest();
        String webMapAsJSON = "{\"layoutOptions\":{\"titleText\":\"\",\"legendOptions\":{\"operationalLayers\":[{\"id\":\"1\"}]},\"authorText\":\"\",\"copyrightText\":\"\",\"scaleBarOptions\":{}},\"exportOptions\":{\"dpi\":96},\"operationalLayers\":[{\"tileMatrixSet\":\"ETRS-TM35FIN\",\"maxScale\":1128,\"format\":\"image\\/png\",\"style\":\"default\",\"id\":\"1\",\"minScale\":18489297,\"title\":\"Taustakartta\",\"opacity\":1,\"type\":\"wmts\",\"url\":\"http:\\/\\/http://192.168.0.110:6080\\/arcgis\\/rest\\/directories\\/arcgisoutput\\/Utilities\\/PrintingTools_GPServer\\/_ags_123.pdf\",\"layer\":\"taustakartta\",\"token\":null}],\"mapOptions\":{\"extent\":{\"ymin\":6448739.432859199,\"xmin\":-11859.958809584263,\"ymax\":7653788.567140801,\"xmax\":863007.9588095843,\"spatialReference\":{\"wkid\":3067}},\"scale\":4244648,\"spatialReference\":{\"wkid\":3067},\"showAttribution\":true}}";
        String webMapAsJSONChangedURL = "{\"layoutOptions\":{\"titleText\":\"\",\"legendOptions\":{\"operationalLayers\":[{\"id\":\"1\"}]},\"authorText\":\"\",\"copyrightText\":\"\",\"scaleBarOptions\":{}},\"exportOptions\":{\"dpi\":96},\"operationalLayers\":[{\"tileMatrixSet\":\"ETRS-TM35FIN\",\"maxScale\":1128,\"format\":\"image\\/png\",\"style\":\"default\",\"id\":\"1\",\"minScale\":18489297,\"title\":\"Taustakartta\",\"opacity\":1,\"type\":\"wmts\",\"url\":\"http:\\/\\/test.example.com\\/api\\/print\\/output\\/_ags_123.pdf\",\"layer\":\"taustakartta\",\"token\":null}],\"mapOptions\":{\"extent\":{\"ymin\":6448739.432859199,\"xmin\":-11859.958809584263,\"ymax\":7653788.567140801,\"xmax\":863007.9588095843,\"spatialReference\":{\"wkid\":3067}},\"scale\":4244648,\"spatialReference\":{\"wkid\":3067},\"showAttribution\":true}}";

        request.setMethod("POST");
        request.setParameter("Format", "PDF");
        request.setParameter("f", "json");
        request.setParameter("Web_Map_as_JSON", webMapAsJSON);

        Layer l = new Layer();
        l.setUrl("http://test.example.com/api/print/output/_ags_123.pdf");
        Mockito.when(layerService.getLayer(1, false, LayerAction.READ_LAYER)).thenReturn(l);

        params.add(new BasicNameValuePair("Format", "PDF"));
        params.add(new BasicNameValuePair("f", "json"));
        params.add(new BasicNameValuePair("Web_Map_as_JSON", webMapAsJSONChangedURL));

        Assert.assertEquals(params, KsrGeoprocessingUtils.createPrintParams(request, layerService));
    }
}
