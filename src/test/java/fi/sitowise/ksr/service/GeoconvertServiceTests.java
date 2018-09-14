package fi.sitowise.ksr.service;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Geoconvert service tests.
 */
@RunWith(SpringRunner.class)
@WebMvcTest(value = SpringRunner.class)
@ContextConfiguration(classes = GeoconvertService.class)
public class GeoconvertServiceTests {
    @Autowired
    GeoconvertService geoconvertService;

    @MockBean
    private HttpServletRequest request;

    @MockBean
    private HttpServletResponse response;

    @MockBean
    private HttpRequestService httpRequestService;

    /**
     * Test get converted data.
     */
    @Test
    public void testGetConvertedDataIsOk() {
        geoconvertService.getConvertedData(request, response, "road", "123", "123");
    }
}
