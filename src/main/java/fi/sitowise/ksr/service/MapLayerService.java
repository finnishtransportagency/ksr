package fi.sitowise.ksr.service;

import fi.sitowise.ksr.domain.MapLayer;
import org.springframework.stereotype.Service;

/**
 * A simple MapLayerService mockup.
 * @TODO: Possibly to be replaced in the future.
 */
@Service
public class MapLayerService {

    /**
     * Get maplayer for given id.
     *
     * @param id Maplayers id
     * @return Matching maplayer or null
     */
    public MapLayer getMapLayerById(Integer id) {
        MapLayer ml = new MapLayer();
        ml.setId(id);
        ml.setUrl("http://paikkatieto.ymparisto.fi/arcgis/services/INSPIRE/SYKE_Hydrografia/MapServer/WmsServer");
        ml.setType("WMS");
        return ml;
    }
}
