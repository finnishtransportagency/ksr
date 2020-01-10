// @flow
import equals from 'nano-equal';
import React, { Component } from 'react';
import EsriMapView from './EsriMapView';
import { highlight } from '../../../../utils/map';
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
    legendWidget: ?Object,
    layerLegendActive: boolean,
    tableButtonAmount: number,
};

class EsriMap extends Component<Props> {
    async componentDidUpdate(prevProps: Props) {
        const {
            layerList,
            view,
            activeNav,
            loadingWorkspace,
            layerLegendActive,
        } = this.props;

        if ((prevProps.layerList &&
            prevProps.layerList.length > 0 &&
            prevProps.layerList !== layerList &&
            view && view.map) ||
            (!loadingWorkspace && loadingWorkspace !== prevProps.loadingWorkspace)
        ) {
            const layerListReversed = [...layerList].reverse();
            const newLayers = [];

            // Update layer settings
            layerListReversed.filter(l => l.type !== 'agfl').forEach((l, i) => {
                // Change layer opacity and visibility
                view.map.layers.forEach((layer) => {
                    if (layer && l.id === layer.id) {
                        layer.visible = l.visible;
                        layer.opacity = l.opacity;
                    }
                });

                if (l.active && !view.map.findLayerById(l.id)) {
                    newLayers.push(l);
                }

                // Change layer order
                view.map.reorder(view.map.findLayerById(`${l.id}`, i));
            });

            if (!loadingWorkspace) {
                if (newLayers.length) {
                    layerListReversed.forEach((l, i) => {
                        view.map.reorder(view.map.findLayerById(`${l.id}`, i));
                    });

                    // Temporary fix for sketchViewModel index.
                    const graphicsLayers = view.map.layers
                        .filter(layer => layer.type === 'graphics');
                    if (graphicsLayers.length) {
                        view.map.layers.removeMany(graphicsLayers);
                        view.map.layers.addMany(graphicsLayers);
                    }
                }
            }

            // Temporary fix for sketchViewModel index.
            const graphicsLayers = view.map.layers
                .filter(layer => layer.type === 'graphics');
            if (graphicsLayers.length) {
                view.map.layers.removeMany(graphicsLayers);
                view.map.layers.addMany(graphicsLayers);
            }
        }

        if (view && view.map) {
            if (activeNav === 'fileExport' && this.props.printWidget) {
                view.ui.add(this.props.printWidget, 'top-left');
            } else {
                view.ui.remove(this.props.printWidget);
            }

            if (this.props.legendWidget && layerLegendActive) {
                view.ui.add(this.props.legendWidget, 'bottom-right');
            } else {
                view.ui.remove(this.props.legendWidget);
            }

            if (this.props.layers.length < 1) {
                setBuffer(view, [], [], 0);
            }
        }

        if (!loadingWorkspace && loadingWorkspace !== prevProps.loadingWorkspace) {
            highlight(view, this.props.selectedFeatures);
        }

        if (!equals(prevProps.selectedFeatures, this.props.selectedFeatures)) {
            highlight(view, this.props.selectedFeatures);
        }

        if (!equals(prevProps.activeAdminTool, this.props.activeAdminTool)) {
            view.popup.close();
        }
    }

    render() {
        const {
            activeNav,
            isOpenTable,
            view,
            activeAdminTool,
            layerLegendActive,
            tableButtonAmount,
        } = this.props;

        return (
            <EsriMapView
                adminToolActive={activeAdminTool !== ''}
                activeNav={activeNav}
                isOpenTable={isOpenTable}
                view={view}
                layerLegendActive={layerLegendActive}
                tableButtonAmount={tableButtonAmount}
            />
        );
    }
}

export default EsriMap;
