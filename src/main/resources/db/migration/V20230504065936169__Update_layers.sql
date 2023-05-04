UPDATE LAYER SET URL = 'https://avoinapi.vaylapilvi.fi/vaylatiedot/ratatiedot/wms', LAYERS = 'sv_tasoristeystiedot', type = 'wms', query_columns = null, WMS_LEGEND = 1 WHERE NAME = 'Tasoristeykset (kaikki)';
UPDATE LAYER SET URL = 'https://avoinapi.vaylapilvi.fi/vaylatiedot/ratatiedot/wms', LAYERS = 'sv_tasoristeysohjelma_kaikki', type = 'wms', query_columns = null, WMS_LEGEND = 1 WHERE NAME = 'Tasoristeykset (poisto- ja parantamishankkeet)';
UPDATE LAYER SET URL = 'https://avoinapi.vaylapilvi.fi/vaylatiedot/ratatiedot/wms', LAYERS = 'sv_tasoristeysohjelma_vuokatti_kontiomaki', type = 'wms', query_columns = null, WMS_LEGEND = 1 WHERE NAME = 'Tasoristeykset (Vuokatti-Kontionmäki-hanke)';
UPDATE LAYER SET URL = 'https://avoinapi.vaylapilvi.fi/vaylatiedot/ratatiedot/wms', LAYERS = 'sv_tasoristeysohjelma_tampere_pori', type = 'wms', query_columns = null, WMS_LEGEND = 1 WHERE NAME = 'Tasoristeykset (Tampere-Pori-hanke)';
UPDATE LAYER SET URL = 'https://avoinapi.vaylapilvi.fi/vaylatiedot/digiroad/wms', LAYERS = 'dr_rautatien_tasoristeys', type = 'wms', query_columns = null, WMS_LEGEND = 1 WHERE NAME = 'Tasoristeykset (Digiroad)';
UPDATE LAYER SET URL = 'https://avoinapi.vaylapilvi.fi/vaylatiedot/ratatiedot/wms', LAYERS = 'locationtracks', type = 'wms', query_columns = null, WMS_LEGEND = 1 WHERE NAME = 'Rataverkko (moniraiteinen)';

UPDATE LAYER SET URL = 'https://avoinapi.vaylapilvi.fi/vaylatiedot/taitorakenteet/wms', LAYERS = 'silta', type = 'wms', query_columns = null, WMS_LEGEND = 1 WHERE NAME = 'Sillat';
UPDATE LAYER SET URL = 'https://avoinapi.vaylapilvi.fi/vaylatiedot/taitorakenteet/wms', LAYERS = 'rautatierumpu', type = 'wms', query_columns = null, WMS_LEGEND = 1 WHERE NAME = 'Rummut';

delete from layer_permission where layer_id in (select id from layer where name in ('Tasoristeykset (Top65-hanke)', 'Tasoristeykset (Toijala-Valkeakoski-hanke)', 'Rataverkko', 'Rataverkon sillat'));
delete from layer where name in ('Tasoristeykset (Top65-hanke)', 'Tasoristeykset (Toijala-Valkeakoski-hanke)', 'Rataverkko', 'Rataverkon sillat');

UPDATE LAYER_GROUP SET NAME = 'Taitorakennerekisteri' WHERE NAME = 'Tierekisteri';
