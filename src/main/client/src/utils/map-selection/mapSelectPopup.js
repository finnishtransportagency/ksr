// @flow
import strings from '../../translations';
import { graphicsToEsriJSON } from '../arcFormats';
import { getIntersectFeatures } from './getIntersectFeatures';
import { getStreetViewLink } from './streetView';

/**
 * Finds and selects visible features on map click
 *
 * Opens popup with info about found features
 * and adds new action button for selecting intersecting features
 *
 * @param event Object click event
 * @param view Object esri map view
 * @param selectFeatures Function redux function that selects features
 * @param layerList Array of layers
 * @param adminToolActive string id of current admin tool layer
 * @param setActiveModal set active modal
 * @param setSingleLayerGeometry geometry for single feature
 */
export const mapSelectPopup = (
    event: Object,
    view: Object,
    selectFeatures: Function,
    layerList: Array<Object>,
    adminToolActive: string,
    setActiveModal: Function,
    setSingleLayerGeometry: Function,
) => {
    if (event.button === 0) {
        const swLink = getStreetViewLink(event.mapPoint.x, event.mapPoint.y);

        view.popup = {
            collapseEnabled: false,
            dockOptions: {
                position: 'top-left',
            },
        };

        const point = {
            x: event.x,
            y: event.y,
        };

        view.hitTest(point).then(({ results }) => {
            const newResults = adminToolActive
                ? [...results.filter(r => r.graphic.layer.id === adminToolActive)]
                : [...results];

            newResults.forEach((layer) => {
                const fieldInfos = [];
                const queryColumns = layerList
                    .filter(ll => ll.id === layer.graphic.layer.id)
                    .map(ll => ll.queryColumns);

                queryColumns[0].forEach((r) => {
                    fieldInfos.push({
                        fieldName: r,
                        label: r,
                    });
                });

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
                    getIntersectFeatures(
                        layerId,
                        featureGeom,
                        view,
                        selectFeatures,
                        adminToolActive,
                    );
                } else if (evt.action.id === 'set-buffer') {
                    setSingleLayerGeometry(view.popup.viewModel.selectedFeature.geometry);
                    setActiveModal('bufferSelectedData');
                }
            });

            const features = graphicsToEsriJSON(graphics);
            selectFeatures(features);
        });
    }
};
