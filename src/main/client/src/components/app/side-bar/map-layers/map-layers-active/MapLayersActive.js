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
        this.toggleChildLayer = this.toggleChildLayer.bind(this);
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

    toggleChildLayer = (id: string) => {
        const { mapLayerList, toggleLayer } = this.props;
        const childLayers = mapLayerList.filter(l => l._source !== 'search' && l.parentLayer === id);
        childLayers.map((cl) => {
            if (!cl.visible) {
                toggleLayer(cl.id);
            }
            return null;
        });
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
            addNonSpatialContentToTable,
            tableLayers,
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
                        addNonSpatialContentToTable={addNonSpatialContentToTable}
                        tableLayers={tableLayers}
                        toggleChildLayer={this.toggleChildLayer}
                    />
                    <DataLayersActiveView
                        dataLayerList={dataLayerList.filter(l => l.active)}
                        activeAdminTool={activeAdminTool}
                        createNonSpatialFeature={createNonSpatialFeature}
                        mapScale={mapScale}
                        handleAdminModeChange={this.handleAdminModeChange}
                        addNonSpatialContentToTable={addNonSpatialContentToTable}
                        tableLayers={tableLayers}
                    />
                </Fragment>
            );
        }

        return <LoadingIcon loading={fetching} />;
    }
}

export default MapLayersActive;
