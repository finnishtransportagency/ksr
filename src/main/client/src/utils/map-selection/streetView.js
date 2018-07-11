import proj4 from 'proj4';
import { defs } from '../proj4Defs';
import strings from '../../translations';

proj4.defs(defs);

export const getStreetViewLink = (x, y) => {
    const googleLocation = proj4('EPSG:3067', 'EPSG:4326', [x, y]);
    const streetViewUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${googleLocation[1]},${googleLocation[0]}`;
    return `<a href=${streetViewUrl} target="blank">${strings.esriMap.openGoogleStreetView}</a>`;
};
