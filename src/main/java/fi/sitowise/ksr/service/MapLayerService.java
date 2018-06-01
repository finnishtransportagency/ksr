package fi.sitowise.ksr.service;

import fi.sitowise.ksr.domain.MapLayer;
import org.springframework.stereotype.Service;

@Service
public class MapLayerService {

    public MapLayer getMapLayerById(Integer id) {
        MapLayer ml = new MapLayer();
        ml.setId(id);
        ml.setUrl("http://avoindata.maanmittauslaitos.fi/mapcache/wmts/");
        ml.setType("WMTS");
        return ml;
    }
}
