// @flow
import React, { Component, Fragment } from 'react';
import type { DropResult } from 'react-beautiful-dnd';
import { reorder } from '../../../../../utils/reorder';
import LoadingIcon from '../../../shared/LoadingIcon';
import MapLayersActiveView from './MapLayersActiveView';
import DataLayersActiveView from './data-layers-active/DataLayersActiveView';

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
};

type State = {
    /* ... */
};

class MapLayersActive extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.onDragEnd = this.onDragEnd.bind(this);
        this.onOpacityChange = this.onOpacityChange.bind(this);
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

    render() {
        const {
            mapLayerList,
            fetching,
            setActiveAdminTool,
            activeAdminTool,
            createNonSpatialFeature,
            dataLayerList,
            createThemeLayer,
            toggleLayer,
            mapScale,
        } = this.props;
        if (!fetching) {
            return (
                <Fragment>
                    <MapLayersActiveView
                        mapLayerList={mapLayerList}
                        onDragEnd={this.onDragEnd}
                        toggleLayer={toggleLayer}
                        onOpacityChange={this.onOpacityChange}
                        setActiveAdminTool={setActiveAdminTool}
                        activeAdminTool={activeAdminTool}
                        createNonSpatialFeature={createNonSpatialFeature}
                        createThemeLayer={createThemeLayer}
                        mapScale={mapScale}
                    />
                    <DataLayersActiveView
                        dataLayerList={dataLayerList.filter(l => l.active)}
                        setActiveAdminTool={setActiveAdminTool}
                        activeAdminTool={activeAdminTool}
                        createNonSpatialFeature={createNonSpatialFeature}
                        mapScale={mapScale}
                    />
                </Fragment>
            );
        }

        return <LoadingIcon loading={fetching} />;
    }
}

export default MapLayersActive;
