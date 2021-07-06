// @flow
import React, { Component, Fragment } from 'react';
import type { DropResult } from 'react-beautiful-dnd';
import { reorder } from '../../../../../utils/reorder';
import LoadingIcon from '../../../shared/LoadingIcon';
import MapLayersActiveView from './MapLayersActiveView';
import DataLayersActiveView from './data-layers-active/DataLayersActiveView';
import strings from '../../../../../translations';

type Props = {
    mapLayerList: any,
    dataLayerList: any,
    fetching: boolean,
    setLayerList: (Array<any>) => void,
    setActiveAdminTool: (layerId: string, layerList: Array<any>) => void,
    activeAdminTool: string,
    createNonSpatialFeature: () => void,
    createThemeLayer: (layerId: string) => void,
    toggleLayer: (layerId: string) => void,
    mapScale: number,
    showConfirmModal: (
        body: string,
        acceptText: string,
        cancelText: string,
        accept: Function
    ) => void,
    addNonSpatialContentToTable: (layer: Object) => void,
    tableLayers: Object[],
    loadingLayers: string[],
    toggleVisibleZoomOut: (layerId: string, original: number) => void,
    layersVisibleZoomOut: any,
};

type State = {
    /* ... */
};

class MapLayersActive extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.onDragEnd = this.onDragEnd.bind(this);
        this.onOpacityChange = this.onOpacityChange.bind(this);
        this.handleAdminModeChange = this.handleAdminModeChange.bind(this);
        this.populateTable = this.populateTable.bind(this);
    }

    onDragEnd = (result: DropResult) => {
        const { mapLayerList, setLayerList, dataLayerList } = this.props;

        if (!result.destination) {
            return;
        }

        const layerListReorder = reorder(
            mapLayerList,
            result.source.index,
            result.destination.index,
        );

        setLayerList(layerListReorder.concat(dataLayerList));
    };

    onOpacityChange = (evt: Number, id: Number) => {
        const { setLayerList, dataLayerList, mapLayerList } = this.props;
        const foundLayer = mapLayerList.find(l => l.id === id);

        foundLayer.opacity = evt;
        setLayerList(mapLayerList.concat(dataLayerList));
    };

    handleAdminModeChange = (layerId: string) => {
        const {
            contentChange, contentDisable, submitChange, submitDisable, cancel,
        } = strings.modalConfirmAdminChange;

        const {
            showConfirmModal, setActiveAdminTool, mapLayerList, activeAdminTool,
        } = this.props;

        if (activeAdminTool) {
            const disable = activeAdminTool === layerId.replace('.s', '');
            showConfirmModal(
                disable ? contentDisable : contentChange,
                disable ? submitDisable : submitChange,
                cancel,
                () => {
                    setActiveAdminTool(layerId.replace('.s', ''), mapLayerList);
                },
            );
        } else {
            setActiveAdminTool(layerId.replace('.s', ''), mapLayerList);
        }
    };

    populateTable = (layer: Object) => {
        const { tableLayers, showConfirmModal, addNonSpatialContentToTable } = this.props;
        const active = tableLayers.some(tl => tl.id === layer.id);
        if (active) {
            showConfirmModal(
                strings.modalPopulateTable.content,
                strings.modalPopulateTable.submit,
                strings.modalPopulateTable.cancel,
                () => {
                    addNonSpatialContentToTable(layer);
                },
            );
        } else {
            addNonSpatialContentToTable(layer);
        }
    };

    render() {
        const {
            mapLayerList,
            fetching,
            activeAdminTool,
            createNonSpatialFeature,
            dataLayerList,
            createThemeLayer,
            toggleLayer,
            mapScale,
            loadingLayers,
            toggleVisibleZoomOut,
            layersVisibleZoomOut,
        } = this.props;
        if (!fetching) {
            return (
                <Fragment>
                    <MapLayersActiveView
                        mapLayerList={mapLayerList}
                        onDragEnd={this.onDragEnd}
                        toggleLayer={toggleLayer}
                        onOpacityChange={this.onOpacityChange}
                        activeAdminTool={activeAdminTool}
                        createNonSpatialFeature={createNonSpatialFeature}
                        createThemeLayer={createThemeLayer}
                        mapScale={mapScale}
                        handleAdminModeChange={this.handleAdminModeChange}
                        populateTable={this.populateTable}
                        loadingLayers={loadingLayers}
                        toggleVisibleZoomOut={toggleVisibleZoomOut}
                        layersVisibleZoomOut={layersVisibleZoomOut}
                    />
                    <DataLayersActiveView
                        dataLayerList={dataLayerList.filter(l => l.active)}
                        activeAdminTool={activeAdminTool}
                        createNonSpatialFeature={createNonSpatialFeature}
                        mapScale={mapScale}
                        handleAdminModeChange={this.handleAdminModeChange}
                        populateTable={this.populateTable}
                    />
                </Fragment>
            );
        }

        return <LoadingIcon loading={fetching} />;
    }
}

export default MapLayersActive;
