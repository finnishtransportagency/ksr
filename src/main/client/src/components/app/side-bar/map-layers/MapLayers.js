// @flow
import React, { Component } from 'react';
import MapLayersView from './MapLayersView';

type Props = {
    setActiveLayerTab: (string) => void,
    activeTab: string,
    activeModal: string,
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
        const { activeTab, activeModal, setActiveModal } = this.props;

        return (
            <MapLayersView
                handleButtonClickLayers={this.handleButtonClickLayers}
                activeTab={activeTab}
                activeModal={activeModal}
                setActiveModal={setActiveModal}
            />
        );
    }
}

export default MapLayers;
