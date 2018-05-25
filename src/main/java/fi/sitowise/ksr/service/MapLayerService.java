package fi.sitowise.ksr.service;

import fi.sitowise.ksr.domain.MapLayer;
import org.springframework.stereotype.Service;

@Service
public class MapLayerService {

    public MapLayer getMapLayerById(Integer id) {
        MapLayer ml = new MapLayer();
        ml.setId(id);
        ml.setUrl("http://paikkatieto.ymparisto.fi/arcgis/services/INSPIRE/SYKE_Hydrografia/MapServer/WmsServer");
        ml.setType("WMS");
        return ml;
    }
}
