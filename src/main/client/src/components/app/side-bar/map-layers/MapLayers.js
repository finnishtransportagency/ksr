// @flow
import React, { Component } from 'react';
import MapLayersView from './MapLayersView';

type Props = {
    setActiveLayerTab: (string) => void,
    activeTab: string,
    setActiveModal: (string) => void,
};

type State = {
    /* ... */
};

class MapLayers extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.handleButtonClickLayers = this.handleButtonClickLayers.bind(this);
    }

    handleButtonClickLayers = (tab: string) => {
        const { setActiveLayerTab } = this.props;
        setActiveLayerTab(tab);
    };

    render() {
        const { activeTab, setActiveModal } = this.props;

        return (
            <MapLayersView
                handleButtonClickLayers={this.handleButtonClickLayers}
                activeTab={activeTab}
                setActiveModal={setActiveModal}
            />
        );
    }
}

export default MapLayers;
