// @flow
import React, { Component } from 'react';
import type { DropResult } from 'react-beautiful-dnd';
import { reorder } from '../../../../../utils/reorder';
import LoadingIcon from '../../../shared/LoadingIcon';
import MapLayersActiveView from './MapLayersActiveView';

type Props = {
    layerList: any,
    fetching: boolean,
    setLayerList: (Array<any>) => void,
    setActiveAdminTool: (layerId: string) => void,
    adminToolActive: string,
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
        const { layerList, setLayerList } = this.props;

        if (!result.destination) {
            return;
        }

        const layerListReorder = reorder(
            layerList,
            result.source.index,
            result.destination.index,
        );

        setLayerList(layerListReorder);
    };

    onToggleVisibility = (id: Number) => {
        const { setLayerList } = this.props;
        const layerList = [...this.props.layerList];
        const foundLayer = layerList.find(l => l.id === id);

        foundLayer.visible = !foundLayer.visible;
        setLayerList(layerList);
    };

    onOpacityChange = (evt: Number, id: Number) => {
        const { setLayerList } = this.props;
        const layerList = [...this.props.layerList];
        const foundLayer = layerList.find(l => l.id === id);

        foundLayer.opacity = evt;
        setLayerList(layerList);
    };

    render() {
        const { layerList, fetching, setActiveAdminTool, adminToolActive } = this.props;
        if (!fetching) {
            return (
                <MapLayersActiveView
                    layerList={layerList}
                    onDragEnd={this.onDragEnd}
                    onToggleVisibility={this.onToggleVisibility}
                    onOpacityChange={this.onOpacityChange}
                    setActiveAdminTool={setActiveAdminTool}
                    adminToolActive={adminToolActive}
                />
            );
        }

        return <LoadingIcon loading={fetching} />;
    }
}

export default MapLayersActive;
