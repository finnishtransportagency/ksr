// @flow
import React, { Component } from 'react';
import MapLayersView from './MapLayersView';

type Props = {
    setActiveLayerTab: string,
    activeTab: string,
};

type State = {
    layerGroups: Array<any>,
    layersAll: string,
};

const initialState = {
    layerGroups: [],
};

class MapLayers extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = { ...initialState };

        this.handleButtonClickLayers = this.handleButtonClickLayers.bind(this);
    }

    handleButtonClickLayers = (tab: string) => {
        const { setActiveLayerTab } = this.props;
        setActiveLayerTab(tab);
    };

    render() {
        const { activeTab } = this.props;

        return (
            <MapLayersView
                handleButtonClickLayers={this.handleButtonClickLayers}
                activeTab={activeTab}
            />
        );
    }
}

export default MapLayers;
