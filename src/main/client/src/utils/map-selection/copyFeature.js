// @flow

/**
 * Copy selected feature's geometry to temporary graphics layer to allow SketchViewModel to
 * handle updating it.
 *
 * @param {Object} view Esri map view.
 * @param {Object} tempGraphicsLayer GraphicsLayer which holds the graphics created via sketch
 * view model.
 * @param {Object} copiedFeature Feature which geometry is being to copied to sketch view model.
 * @param {Object} sketchViewModel SketchViewModel that handles updating the copied geometry.
 * @param {Function} setTempGraphicsLayer Function for updating temporary graphics layer.
 */
export const copyFeature = (
    view: Object,
    tempGraphicsLayer: Object,
    copiedFeature: Object,
    sketchViewModel: Object,
    setTempGraphicsLayer: Function,
) => {
    view.popup.close();
    tempGraphicsLayer.removeAll();

    switch (copiedFeature.geometry.type) {
        case 'point':
            copiedFeature.symbol = sketchViewModel.pointSymbol;
            break;
        case 'polyline':
            copiedFeature.symbol = sketchViewModel.polylineSymbol;
            break;
        default:
            copiedFeature.symbol = sketchViewModel.polygonSymbol;
            break;
    }
    copiedFeature.type = 'sketch-graphic';
    tempGraphicsLayer.add(copiedFeature);
    setTempGraphicsLayer(tempGraphicsLayer);
};
