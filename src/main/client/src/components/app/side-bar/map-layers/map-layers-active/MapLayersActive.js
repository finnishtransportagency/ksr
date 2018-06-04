// @flow
import React, { Component } from 'react';
import LoadingIcon from '../../../shared/LoadingIcon';
import MapLayersActiveView from './MapLayersActiveView';

type Props = {
    activeLayers: Promise<any>,
};

type State = {
    activeLayers: Array<any>,
    loading: boolean,
};

const initialState = {
    activeLayers: [],
    loading: true,
};

class MapLayersActive extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = { ...initialState };
    }

    componentDidMount() {
        this.generateLayerGroups();
    }

    generateLayerGroups() {
        const { activeLayers } = this.props;
        activeLayers.then(r => this.setState({ activeLayers: r, loading: false }));
    }

    render() {
        const { activeLayers, loading } = this.state;

        if (!loading) {
            return <MapLayersActiveView activeLayers={activeLayers} />;
        }

        return <LoadingIcon loading={loading} />;
    }
}

export default MapLayersActive;
