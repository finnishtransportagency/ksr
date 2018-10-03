package fi.sitowise.ksr.service;

import fi.sitowise.ksr.exceptions.KsrApiException;
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
     * Test get converted data with road type.
     */
    @Test
    public void testGetConvertedRoadDataIsOk() {
        geoconvertService.getConvertedData(request, response, "road", "123", "123");
    }

    /**
     * Test get converted data with railway type.
     */
    @Test
    public void testGetConvertedRailwayDataIsOk() {
        geoconvertService.getConvertedData(request, response, "railway", "123", "123");
    }

    /**
     * Test get converted data throws exception with wrong parameter.
     */
    @Test(expected = KsrApiException.BadRequestException.class)
    public void testGetConvertedDataThrowsException() {
        geoconvertService.getConvertedData(request, response, "test", "123", "123");
    }
}
