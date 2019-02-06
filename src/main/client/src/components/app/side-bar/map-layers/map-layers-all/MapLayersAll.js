// @flow
import React, { Component } from 'react';
import LoadingIcon from '../../../shared/LoadingIcon';
import MapLayersAllView from './MapLayersAllView';

type Props = {
    layerGroups: Array<any>,
    layerList: any,
    subLayers: Object[],
    fetching: boolean,
    loadingLayers: string[],
    activateLayers: (layers: Object[]) => void,
    deactivateLayer: (layerId: string) => void,
};

type State = {
    activeGroup: number,
    activeSubGroup: number,
};

const initialState = {
    activeGroup: 0,
    activeSubGroup: 0,
};

class MapLayersActive extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = { ...initialState };

        this.handleGroupClick = this.handleGroupClick.bind(this);
        this.handleSubGroupClick = this.handleSubGroupClick.bind(this);
        this.handleLayerClick = this.handleLayerClick.bind(this);
        this.handleLayerGroupClick = this.handleLayerGroupClick.bind(this);
        this.handleSubLayerGroupClick = this.handleSubLayerGroupClick.bind(this);
    }

    handleGroupClick = (id: number) => {
        const { activeGroup } = this.state;

        if (activeGroup === id) {
            this.setState({ activeGroup: 0 });
        } else {
            this.setState({ activeGroup: id });
        }
    };

    handleSubGroupClick = (id: number) => {
        const { activeSubGroup } = this.state;

        if (activeSubGroup === id) {
            this.setState({ activeSubGroup: 0 });
        } else {
            this.setState({ activeSubGroup: id });
        }
    };

    handleLayerClick = (id: number) => {
        const { activateLayers, deactivateLayer, layerList } = this.props;
        const foundLayer = layerList.find(l => l.id === id);

        if (!foundLayer.active) {
            activateLayers([foundLayer]);
        } else {
            deactivateLayer(foundLayer.id);
        }
    };

    handleLayerGroupClick = (layerGroupName: string) => {
        const { layerList } = this.props;
        const foundLayers = layerList.filter(l =>
            l.layerGroupName === layerGroupName
            && !l.parentLayer
            && l.relationType !== 'link'
            && l._source !== 'shapefile');

        this.updateLayerList(foundLayers);
    };

    handleSubLayerGroupClick = (id: number) => {
        const { subLayers, layerList } = this.props;
        const parentLayer = layerList.filter(l => l.id === id);
        const filteredSublayers = subLayers.filter(l => l.parentLayer === id);
        const foundLayers = [...new Set([...parentLayer, ...filteredSublayers])];

        this.updateLayerList(foundLayers);
    };

    updateLayerList = (foundLayers: Object[]) => {
        const { activateLayers, deactivateLayer, loadingLayers } = this.props;
        const active = foundLayers.every(l => l.active);

        if (active) {
            foundLayers.forEach(foundLayer => deactivateLayer(foundLayer.id));
        } else {
            const layersToBeActivated = foundLayers.filter(foundLayer => (
                !foundLayer.active && !loadingLayers.some(layerId => layerId === foundLayer.id)
            ));
            if (layersToBeActivated.length) activateLayers(layersToBeActivated);
        }
    };

    render() {
        const { activeGroup, activeSubGroup } = this.state;
        const {
            layerGroups, fetching, layerList, subLayers,
        } = this.props;

        if (!fetching) {
            return (
                <MapLayersAllView
                    layerGroups={layerGroups}
                    layerList={layerList}
                    handleGroupClick={this.handleGroupClick}
                    handleSubGroupClick={this.handleSubGroupClick}
                    handleLayerClick={this.handleLayerClick}
                    activeGroup={activeGroup}
                    activeSubGroup={activeSubGroup}
                    handleLayerGroupClick={this.handleLayerGroupClick}
                    handleSubLayerGroupClick={this.handleSubLayerGroupClick}
                    subLayers={subLayers}
                />
            );
        }

        return <LoadingIcon loading={fetching} />;
    }
}

export default MapLayersActive;
