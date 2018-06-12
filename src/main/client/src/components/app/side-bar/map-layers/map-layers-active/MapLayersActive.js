// @flow
import React, { Component } from 'react';
import LoadingIcon from '../../../shared/LoadingIcon';
import MapLayersActiveView from './MapLayersActiveView';

type Props = {
    activeLayers: Promise<any>,
    getActiveLayers: () => void,
    activeLayers: {
        activeLayers: Array<any>,
        fetching: boolean,
    },
};

type State = {
    /* ... */
};

/*
* Drag and drop stuff
*/

const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: 'none',
    background: isDragging ? '#444444' : 'transparent',
    ...draggableStyle,
});

/*
* Drag and drop stuff
*/

class MapLayersActive extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.onDragEnd = this.onDragEnd.bind(this);
    }

    componentDidMount() {
        const { getActiveLayers } = this.props;

        getActiveLayers();
    }

    onDragEnd = (result) => {
        // dropped outside the list
        console.log(result.destination);

        if (!result.destination) {
            return;
        }
    };

    render() {
        const { activeLayers } = this.props;

        if (!activeLayers.fetching) {
            return (
                <MapLayersActiveView
                    activeLayers={activeLayers.activeLayers}
                    getItemStyle={getItemStyle}
                    onDragEnd={this.onDragEnd}
                />
            );
        }

        return <LoadingIcon loading={activeLayers.fetching} />;
    }
}

export default MapLayersActive;
