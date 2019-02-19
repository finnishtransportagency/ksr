// @flow
import React, { Component } from 'react';
import MapLayersView from './MapLayersView';

type Props = {
    setActiveLayerTab: (string) => void,
    activeTab: string,
    setActiveModal: (modal: string) => void,
    toggleDropzoneActive: () => void,
    toggleLayerLegend: () => void,
    layerLegendActive: boolean,
};

type State = {
    /* ... */
};

class MapLayers extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.handleButtonClickLayers = this.handleButtonClickLayers.bind(this);
        this.toggleLayerLegend = this.toggleLayerLegend.bind(this);
    }

    handleButtonClickLayers = (tab: string) => {
        const { setActiveLayerTab } = this.props;
        setActiveLayerTab(tab);
    };

    toggleLayerLegend = () => {
        this.props.toggleLayerLegend();
    };

    render() {
        const {
            activeTab,
            setActiveModal,
            toggleDropzoneActive,
            layerLegendActive,
        } = this.props;

        return (
            <MapLayersView
                handleButtonClickLayers={this.handleButtonClickLayers}
                activeTab={activeTab}
                setActiveModal={setActiveModal}
                toggleDropzoneActive={toggleDropzoneActive}
                layerLegendActive={layerLegendActive}
                toggleLayerLegend={this.toggleLayerLegend}
            />
        );
    }
}

export default MapLayers;
