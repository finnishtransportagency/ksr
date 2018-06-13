// @flow
import React, { Component } from 'react';
import type { DropResult } from 'react-beautiful-dnd';
import { reorder } from '../../../../../utils/reorder';
import LoadingIcon from '../../../shared/LoadingIcon';
import MapLayersActiveView from './MapLayersActiveView';

type Props = {
    layerList: Array<any>,
    fetching: boolean,
    setLayerList: (Array<any>) => void,
};

type State = {
    /* ... */
};

class MapLayersActive extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.onDragEnd = this.onDragEnd.bind(this);
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

    render() {
        const { layerList, fetching } = this.props;

        if (!fetching) {
            return (
                <MapLayersActiveView
                    activeLayers={layerList}
                    onDragEnd={this.onDragEnd}
                />
            );
        }

        return <LoadingIcon loading={fetching} />;
    }
}

export default MapLayersActive;
