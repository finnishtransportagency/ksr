package fi.sitowise.ksr.domain.esri;

import org.apache.commons.io.IOUtils;
import org.apache.http.HttpEntity;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.message.BasicNameValuePair;
import org.junit.Assert;
import org.junit.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@SpringBootTest
public class FeatureTests {

    @Test
    public void testToParamsAdds() throws Exception{
        List<NameValuePair> params = new ArrayList<>();
        params.add(new BasicNameValuePair("f", "json"));
        params.add(new BasicNameValuePair("adds", "[{\"attributes\":{\"id\":2}}]"));
        HttpEntity expected = new UrlEncodedFormEntity(params, StandardCharsets.UTF_8);
        Feature feature = new Feature.Builder().withParameter("id", 2).build();

        Assert.assertTrue(IOUtils.contentEquals(expected.getContent(), feature.toParams(EditType.ADD).getContent()));
    }

    @Test
    public void testToParamsUpdates() throws Exception{
        List<NameValuePair> params = new ArrayList<>();
        params.add(new BasicNameValuePair("f", "json"));
        params.add(new BasicNameValuePair("updates", "[{\"attributes\":{\"id\":2}}]"));
        HttpEntity expected = new UrlEncodedFormEntity(params, StandardCharsets.UTF_8);

        Feature feature = new Feature.Builder().withParameter("id", 2).build();

        Assert.assertTrue(IOUtils.contentEquals(expected.getContent(), feature.toParams(EditType.UPDATE).getContent()));
    }

    @Test(expected = NullPointerException.class)
    public void testToParamsUpdatesInvalidArgument() throws Exception {
        Feature feature = new Feature();
        feature.toParams(null);
    }
}
