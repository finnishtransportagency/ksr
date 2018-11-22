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
};

type State = {
    /* ... */
};

class MapLayersActive extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.onDragEnd = this.onDragEnd.bind(this);
        this.onToggleVisibility = this.onToggleVisibility.bind(this);
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

    onToggleVisibility = (id: Number) => {
        const { setLayerList, dataLayerList } = this.props;
        const mapLayerList = [...this.props.mapLayerList];
        const newMapLayerList = mapLayerList.map((l) => {
            if (l.id === id) {
                return {
                    ...l,
                    visible: !l.visible,
                };
            }
            return { ...l };
        });
        setLayerList(newMapLayerList.concat(dataLayerList));
    };

    onOpacityChange = (evt: Number, id: Number) => {
        const { setLayerList, dataLayerList } = this.props;
        const mapLayerList = [...this.props.mapLayerList];
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
        } = this.props;
        if (!fetching) {
            return (
                <Fragment>
                    <MapLayersActiveView
                        mapLayerList={mapLayerList}
                        dataLayerList={dataLayerList.filter(l => l.active)}
                        onDragEnd={this.onDragEnd}
                        onToggleVisibility={this.onToggleVisibility}
                        onOpacityChange={this.onOpacityChange}
                        setActiveAdminTool={setActiveAdminTool}
                        activeAdminTool={activeAdminTool}
                        createNonSpatialFeature={createNonSpatialFeature}
                    />
                    <DataLayersActiveView
                        dataLayerList={dataLayerList.filter(l => l.active)}
                        setActiveAdminTool={setActiveAdminTool}
                        activeAdminTool={activeAdminTool}
                        createNonSpatialFeature={createNonSpatialFeature}
                    />
                </Fragment>
            );
        }

        return <LoadingIcon loading={fetching} />;
    }
}

export default MapLayersActive;
