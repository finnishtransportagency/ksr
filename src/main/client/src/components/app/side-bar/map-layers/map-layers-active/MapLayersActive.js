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
    setActiveAdminTool: (layerId: string, layerList: Array<any>) => void,
    activeAdminTool: string,
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
        const newLayerList = layerList.map((l) => {
            if (l.id === id) {
                return {
                    ...l,
                    visible: !l.visible,
                };
            }
            return { ...l };
        });
        setLayerList(newLayerList);
    };

    onOpacityChange = (evt: Number, id: Number) => {
        const { setLayerList } = this.props;
        const layerList = [...this.props.layerList];
        const foundLayer = layerList.find(l => l.id === id);

        foundLayer.opacity = evt;
        setLayerList(layerList);
    };

    render() {
        const {
            layerList, fetching, setActiveAdminTool, activeAdminTool,
        } = this.props;
        if (!fetching) {
            return (
                <MapLayersActiveView
                    layerList={layerList}
                    onDragEnd={this.onDragEnd}
                    onToggleVisibility={this.onToggleVisibility}
                    onOpacityChange={this.onOpacityChange}
                    setActiveAdminTool={setActiveAdminTool}
                    activeAdminTool={activeAdminTool}
                />
            );
        }

        return <LoadingIcon loading={fetching} />;
    }
}

export default MapLayersActive;
