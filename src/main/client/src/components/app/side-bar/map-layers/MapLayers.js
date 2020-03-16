// @flow
import React, { Component } from 'react';
import MapLayersView from './MapLayersView';

type Props = {
    layerGroups: Object,
    setActiveLayerTab: (string) => void,
    activeTab: string,
    setActiveModal: (modal: string) => void,
    toggleLayerLegend: () => void,
    layerLegendActive: boolean,
    toggleIndexMap: Function,
    indexMapActive: boolean,
};

type State = {
    activeGroups: number[],
    activeSubGroups: number[],
    layersToFind: string,
};

const initialState = {
    activeGroups: [],
    activeSubGroups: [],
    layersToFind: '',
};

class MapLayers extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = { ...initialState };

        this.handleButtonClickLayers = this.handleButtonClickLayers.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
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
        const { activeTab, setActiveLayerTab } = this.props;
        if (activeTab !== tab) {
            document.getElementsByClassName('layer-view-inner-scroll-wrapper')[0].scrollTop = 0;
        }
        setActiveLayerTab(tab);
    };

    handleInputChange = (event: Object) => {
        const { layerGroups } = this.props;
        const layersToFind = event.target.value;
        const activeGroups = layersToFind ? layerGroups.layerGroups.map(group => group.id) : [];
        const activeSubGroups = layersToFind
            ? layerGroups.layerList.filter(layer => layer.parentLayer)
                .map(layer => layer.parentLayer)
            : [];

        this.setState({ layersToFind, activeGroups, activeSubGroups });
    };

    render() {
        const { layersToFind, activeGroups, activeSubGroups } = this.state;
        const {
            activeTab,
            setActiveModal,
            layerLegendActive,
            toggleLayerLegend,
            toggleIndexMap,
            indexMapActive,
        } = this.props;

        return (
            <MapLayersView
                handleButtonClickLayers={this.handleButtonClickLayers}
                activeTab={activeTab}
                setActiveModal={setActiveModal}
                layerLegendActive={layerLegendActive}
                toggleLayerLegend={toggleLayerLegend}
                handleInputChange={this.handleInputChange}
                layersToFind={layersToFind}
                activeGroups={activeGroups}
                activeSubGroups={activeSubGroups}
                setActiveGroups={this.setActiveGroups}
                setActiveSubGroups={this.setActiveSubGroups}
                toggleIndexMap={toggleIndexMap}
                indexMapActive={indexMapActive}
            />
        );
    }
}

export default MapLayers;
