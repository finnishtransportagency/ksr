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
    activeGroups: number[],
    activeSubGroups: number[],
};

const initialState = {
    activeGroups: [],
    activeSubGroups: [],
};

class MapLayers extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = { ...initialState };

        this.handleButtonClickLayers = this.handleButtonClickLayers.bind(this);
        this.toggleLayerLegend = this.toggleLayerLegend.bind(this);
        this.setActiveGroups = this.setActiveGroups.bind(this);
        this.setActiveSubGroups = this.setActiveSubGroups.bind(this);
    }

    setActiveGroups = (activeGroups: number[]) => {
        this.setState({ activeGroups });
    };

    setActiveSubGroups = (activeSubGroups: number[]) => {
        this.setState({ activeSubGroups });
    };

    handleButtonClickLayers = (tab: string) => {
        const { setActiveLayerTab } = this.props;
        setActiveLayerTab(tab);
    };

    toggleLayerLegend = () => {
        this.props.toggleLayerLegend();
    };

    render() {
        const { activeGroups, activeSubGroups } = this.state;
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
                activeGroups={activeGroups}
                activeSubGroups={activeSubGroups}
                setActiveGroups={this.setActiveGroups}
                setActiveSubGroups={this.setActiveSubGroups}
            />
        );
    }
}

export default MapLayers;
