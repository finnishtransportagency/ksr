// @flow
import React, { Component } from 'react';
import MapLayersView from './MapLayersView';

type Props = {
    setActiveLayerTab: (string) => void,
    activeTab: string,
    activeModal: string,
    setActiveModal: (modal: string) => void,
    setDropzoneActive: () => void,
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
        const { activeTab, setActiveModal, setDropzoneActive } = this.props;

        return (
            <MapLayersView
                handleButtonClickLayers={this.handleButtonClickLayers}
                activeTab={activeTab}
                setActiveModal={setActiveModal}
                setDropzoneActive={setDropzoneActive}
            />
        );
    }
}

export default MapLayers;
