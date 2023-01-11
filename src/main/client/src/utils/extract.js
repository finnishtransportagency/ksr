// @flow
// import { loadModules } from 'esri-loader';

import Graphic from '@arcgis/core/Graphic';
import * as Geoprocessor from '@arcgis/core/rest/geoprocessor';
import FeatureSet from '@arcgis/core/rest/support/FeatureSet';

/**
 * Extract selected features to desired format.
 *
 * @param {string} extractServiceUrl Url for the extract service.
 * @param {string} layerId Identifier for the layer from which the data is extracted.
 * @param {Object[]} selectedGeometryData Array of geometry data.
 * @param {string} format Desired extract format.
 */
export const extractSelected = (
    extractServiceUrl: string,
    layerId: string,
    selectedGeometryData: Array<Object>,
    format: string,
) => {
    const gp = new Geoprocessor(extractServiceUrl);
    const inputGraphicContainer = selectedGeometryData
        .map(geometry => new Graphic({ geometry }));
    const featureSet = new FeatureSet({ features: inputGraphicContainer });

    return gp.submitJob({
        Layers_to_Clip: layerId.replace('_s', ''),
        Area_of_Interest: featureSet,
        Feature_Format: format,
    }).then(result => gp.waitForJobCompletion(result.jobId))
        .then(r => gp.getResultData(r.jobId, 'Output_Zip_File'))
        .then(res => res.value.url);
};
