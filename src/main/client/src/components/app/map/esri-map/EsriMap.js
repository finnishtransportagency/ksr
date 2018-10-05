// @flow
import equals from 'nano-equal';
import React, { Component } from 'react';
import EsriMapView from './EsriMapView';
import { addLayers, highlight, fitExtent } from '../../../../utils/map';
import { setBuffer } from '../../../../utils/buffer';

type Props = {
    view: Object,
    activeNav: string,
    layerList: Array<any>,
    isOpenTable: boolean,
    selectedFeatures: Array<Object>,
    activeAdminTool: string,
    layers: Array<Object>,
    loadingWorkspace: boolean,
    printWidget: any,
    removeLayersView: (layerIds: Object[]) => void,
};

class EsriMap extends Component<Props> {
    componentDidUpdate(prevProps: Props) {
        const {
            layerList,
            view,
            activeNav,
            loadingWorkspace,
        } = this.props;

        if ((prevProps.layerList &&
            prevProps.layerList.length > 0 &&
            prevProps.layerList !== layerList &&
            view && view.map) ||
            (!loadingWorkspace && loadingWorkspace !== prevProps.loadingWorkspace)
        ) {
            const layerListReversed = [...layerList].reverse();
            const searchLayers = [];
            const newLayers = [];
            const toBeRemoved = [];

            // Update layer settings
            layerListReversed.forEach((l, i) => {
                // Change layer opacity and visibility
                view.map.layers.forEach((layer) => {
                    if (layer && l.id === layer.id) {
                        layer.visible = l.visible;
                        layer.opacity = l.opacity;
                        if (l.type === 'agfs') {
                            if (layer.definitionExpression !== l.definitionExpression) {
                                layer.definitionExpression = l.definitionExpression;
                                if (l._source === 'search') {
                                    searchLayers.push(layer);
                                }
                            }
                        }
                        if (!l.active) toBeRemoved.push(layer.id);
                    }
                });

                if (l.active && !view.map.findLayerById(l.id)) {
                    l.visible = true;
                    l.index = i;
                    newLayers.push(l);
                }

                // Change layer order
                view.map.reorder(view.map.findLayerById(`${l.id}`, i));
            });

            if (!loadingWorkspace) {
                if (toBeRemoved.length > 0) {
                    this.props.removeLayersView(toBeRemoved);
                }

                if (newLayers.length) {
                    addLayers(newLayers, view, searchLayers)
                        .then(() => {
                            layerListReversed.forEach((l, i) => {
                                view.map.reorder(view.map.findLayerById(`${l.id}`, i));
                            });
                        });
                } else if (searchLayers.length) {
                    fitExtent(searchLayers, view);
                }
            }

            view.map.layers.forEach((l) => {
                // Temporary fix for sketchViewModel index
                if (l.id.indexOf('layer') >= 0) {
                    view.map.reorder(view.map.findLayerById(`${l.id}`, view.map.layers.length));
                }
            });
        }

        if (view && view.map) {
            if (activeNav === 'fileExport' && this.props.printWidget) {
                view.ui.add(this.props.printWidget, 'top-left');
            } else {
                view.ui.remove(this.props.printWidget);
            }

            if (this.props.layers.length < 1) {
                setBuffer(view, [], 0);
            }
        }

        if (!loadingWorkspace && loadingWorkspace !== prevProps.loadingWorkspace) {
            highlight(view, this.props.selectedFeatures, this.props.activeAdminTool);
        }

        if (!equals(prevProps.selectedFeatures, this.props.selectedFeatures)) {
            highlight(view, this.props.selectedFeatures, this.props.activeAdminTool);
        }
    }

    render() {
        const { activeNav, isOpenTable, view } = this.props;

        return (
            <EsriMapView
                activeNav={activeNav}
                isOpenTable={isOpenTable}
                view={view}
            />
        );
    }
}

export default EsriMap;
