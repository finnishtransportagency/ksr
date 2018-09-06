// @flow
import strings from '../../translations';
import { graphicsToEsriJSON } from '../arcFormats';
import { queryFeatures } from '../queryFeatures';

/**
 * Finds and selects visible features on map click
 *
 * Opens popup with info about found features
 * and adds new action button for selecting intersecting features
 *
 * @param results Object results from click event
 * @param swLink any link to google street viw
 * @param view Object esri map view
 * @param selectFeatures Function redux function that selects features
 * @param layerList Array of layers
 * @param adminToolActive string id of current admin tool layer
 * @param setActiveModal set active modal
 * @param setSingleLayerGeometry geometry for single feature
 */
export const mapSelectPopup = (
    results: Object,
    swLink: any,
    view: Object,
    selectFeatures: Function,
    layerList: Array<Object>,
    adminToolActive: string,
    setActiveModal: Function,
    setSingleLayerGeometry: Function,
) => {
    view.popup = {
        collapseEnabled: false,
        dockOptions: {
            position: 'top-left',
        },
    };

    const newResults = adminToolActive
        ? [...results.filter(r => r.graphic.layer.id === adminToolActive)]
        : [...results];

    newResults.forEach((layer) => {
        const fieldInfos = [];
        const queryColumns = layerList
            .filter(ll => ll.id === layer.graphic.layer.id)
            .map(ll => ll.queryColumns);

        if (queryColumns[0]) {
            queryColumns[0].forEach((r) => {
                fieldInfos.push({
                    fieldName: r,
                    label: r,
                });
            });
        }

        const selectIntersectAction = {
            title: strings.esriMap.selectIntersectFeatures,
            id: 'select-intersect',
            className: 'esri-icon-maps',
        };

        const setBufferAction = {
            title: strings.esriMap.setBuffer,
            id: 'set-buffer',
            className: 'far fa-dot-circle',
        };

        layer.graphic.layer.popupTemplate = {
            title: layer.graphic.layer.title,
            content: [{
                type: 'text',
                text: swLink,
            }, {
                type: 'fields',
                fieldInfos,
            }],
            actions: [selectIntersectAction, setBufferAction],
        };
    });

    const graphics = newResults.map(re => re.graphic);

    view.popup.on('trigger-action', (evt) => {
        if (evt.action.id === 'select-intersect') {
            const layerId = view.popup.viewModel.selectedFeature.layer.id;
            const featureGeom = view.popup.viewModel.selectedFeature.geometry;
            queryFeatures(featureGeom, adminToolActive, view, selectFeatures, layerId);
        } else if (evt.action.id === 'set-buffer') {
            setSingleLayerGeometry(view.popup.viewModel.selectedFeature.geometry);
            setActiveModal('bufferSelectedData');
        }
    });

    const features = graphicsToEsriJSON(graphics);
    selectFeatures(features);
};
