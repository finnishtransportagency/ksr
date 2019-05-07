package fi.sitowise.ksr.domain.esri;

import org.junit.Assert;
import org.junit.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

@SpringBootTest
public class QueryFeatureTests {

    @Test
    public void testFromInputStream() {
        InputStream is = new ByteArrayInputStream("{\"feature\":{\"attributes\":{\"NAME\":\"Test feature\",\"STATUS\":\"OK\",\"TYPE\":20}}}".getBytes(StandardCharsets.UTF_8));
        Feature feat = new Feature.Builder()
                .withParameter("NAME", "Test feature")
                .withParameter("STATUS", "OK")
                .withParameter("TYPE", 20)
                .build();

        QueryFeature expected = new QueryFeature();
        expected.setFeature(feat);

        Assert.assertEquals(expected, QueryFeature.fromInputStream(is));
    }

}
