package fi.sitowise.ksr.domain;

import org.junit.Assert;
import org.junit.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Optional;

@SpringBootTest
public class LayerTests {

    @Test
    public void testGetApplyEditsUrlAgfs() {
        Optional<String> expected = Optional.of("http://layer.ksr/0/applyEdits");
        Layer layer = new Layer();
        layer.setUrl("http://layer.ksr/0");
        layer.setType("agfs");
        Assert.assertEquals(expected, layer.getApplyEditsUrl());
    }

    @Test
    public void testGetApplyEditsUrlAgfl() {
        Optional<String> expected = Optional.of("http://layer.ksr/0/applyEdits");
        Layer layer = new Layer();
        layer.setUrl("http://layer.ksr/0");
        layer.setType("agfl");
        Assert.assertEquals(expected, layer.getApplyEditsUrl());
    }

    @Test
    public void testGetApplyEditsUrlNonAgflOrAgfsl() {
        Assert.assertEquals(Optional.empty(), (new Layer()).getApplyEditsUrl());
    }

    @Test
    public void testGetGetFeatureUrlAgfs() {
        Optional<String> expected = Optional.of(
                "http://layer.ksr/0/query?f=pjson&returnGeometry=false&outFields=*&where=test+IN+%28123%29"
        );
        Layer layer = new Layer();
        layer.setUrl("http://layer.ksr/0");
        layer.setType("agfs");
        Assert.assertEquals(expected, layer.getGetFeaturesUrl("test", 123));
    }

    @Test
    public void testGetGetFeatureUrlAgfl() {
        Optional<String> expected = Optional.of(
                "http://layer.ksr/0/query?f=pjson&returnGeometry=false&outFields=*&where=test+IN+%28123%29"
        );
        Layer layer = new Layer();
        layer.setUrl("http://layer.ksr/0");
        layer.setType("agfl");
        Assert.assertEquals(expected, layer.getGetFeaturesUrl("test", 123));
    }

    @Test
    public void testGetGetFeatureUrlNonAgflOrAgfs() {
        Assert.assertEquals(Optional.empty(), (new Layer()).getGetFeaturesUrl("test", 123));
    }

    @Test
    public void testGetGetWithObjectIdUrlAgfs() {
        Optional<String> expected = Optional.of("http://layer.ksr/1/123456?f=pjson");
        Layer layer = new Layer();
        layer.setUrl("http://layer.ksr/1");
        layer.setType("agfs");
        Assert.assertEquals(expected, layer.getGetWithObjectIdUrl(123456));
    }

    @Test
    public void testGetGetWithObjectIdUrlAgfl() {
        Optional<String> expected = Optional.of("http://layer.ksr/1/123456?f=pjson");
        Layer layer = new Layer();
        layer.setUrl("http://layer.ksr/1");
        layer.setType("agfl");
        Assert.assertEquals(expected, layer.getGetWithObjectIdUrl(123456));
    }

    @Test
    public void testGetGetWithObjectIdUrlNotAgfsOrAgfl() {
        Assert.assertEquals(Optional.empty(), (new Layer()).getGetWithObjectIdUrl(123456));
    }

    @Test
    public void testGetLayerDefinitionUrlAgfs() {
        Optional<String> expected = Optional.of("http://layer.ksr/1?f=pjson");
        Layer layer = new Layer();
        layer.setUrl("http://layer.ksr/1");
        layer.setType("agfs");
        Assert.assertEquals(expected, layer.getLayerDefitionUrl());
    }

    @Test
    public void testGetLayerDefinitionUrlAgfl() {
        Optional<String> expected = Optional.of("http://layer.ksr/1?f=pjson");
        Layer layer = new Layer();
        layer.setUrl("http://layer.ksr/1");
        layer.setType("agfl");
        Assert.assertEquals(expected, layer.getLayerDefitionUrl());
    }

    @Test
    public void testGetLayerDefinitionUrlNonAgfsOrAgfl() {
        Assert.assertEquals(Optional.empty(), (new Layer()).getLayerDefitionUrl());
    }

    @Test
    public void testGetDeleteFeaturesUrlAgfs() {
        Optional<String> expected = Optional.of("http://layer.ksr/1/deleteFeatures");
        Layer layer = new Layer();
        layer.setUrl("http://layer.ksr/1");
        layer.setType("agfs");
        Assert.assertEquals(expected, layer.getDeleteFeaturesUrl());
    }

    @Test
    public void testGetDeleteFeaturesUrlAgfl() {
        Optional<String> expected = Optional.of("http://layer.ksr/1/deleteFeatures");
        Layer layer = new Layer();
        layer.setUrl("http://layer.ksr/1");
        layer.setType("agfl");
        Assert.assertEquals(expected, layer.getDeleteFeaturesUrl());
    }

    @Test
    public void testGetDeleteFeaturesUrlNonAgflOrAgfs() {
        Assert.assertEquals(Optional.empty(), (new Layer()).getDeleteFeaturesUrl());
    }
}
