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
    }
};

type State = {
    /* ... */
};

class MapLayersActive extends Component<Props, State> {
    componentDidMount() {
        const { getActiveLayers } = this.props;

        getActiveLayers();
    }

    render() {
        const { activeLayers } = this.props;

        if (!activeLayers.fetching) {
            return <MapLayersActiveView activeLayers={activeLayers.activeLayers} />;
        }

        return <LoadingIcon loading={activeLayers.fetching} />;
    }
}

export default MapLayersActive;
