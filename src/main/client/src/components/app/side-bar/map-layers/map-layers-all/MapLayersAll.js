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
    activeGroups: number[],
    activeSubGroups: number[],
    setActiveGroups: (activeGroups: number[]) => void,
    setActiveSubGroups: (activeSubGroups: number[]) => void,
};

class MapLayersActive extends Component<Props> {
    constructor(props: Props) {
        super(props);

        this.handleGroupClick = this.handleGroupClick.bind(this);
        this.handleSubGroupClick = this.handleSubGroupClick.bind(this);
        this.handleLayerClick = this.handleLayerClick.bind(this);
        this.handleLayerGroupClick = this.handleLayerGroupClick.bind(this);
        this.handleSubLayerGroupClick = this.handleSubLayerGroupClick.bind(this);
    }

    handleGroupClick = (id: number) => {
        const { activeGroups, setActiveGroups } = this.props;

        const newGroups = activeGroups.filter(group => group !== id);
        if (newGroups.length === activeGroups.length) newGroups.push(id);
        setActiveGroups(newGroups);
    };

    handleSubGroupClick = (id: number) => {
        const { activeSubGroups, setActiveSubGroups } = this.props;

        const newSubGroups = activeSubGroups.filter(group => group !== id);
        if (newSubGroups.length === activeSubGroups.length) newSubGroups.push(id);
        setActiveSubGroups(newSubGroups);
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
        const active = foundLayers.filter(f => !f.failOnLoad).length > 0 ?
            foundLayers.filter(f => !f.failOnLoad).every(l => l.active) :
            foundLayers.every(l => l.active);

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
        const {
            layerGroups,
            fetching,
            layerList,
            subLayers,
            loadingLayers,
            activeGroups,
            activeSubGroups,
        } = this.props;

        if (!fetching) {
            return (
                <MapLayersAllView
                    layerGroups={layerGroups}
                    layerList={layerList}
                    handleGroupClick={this.handleGroupClick}
                    handleSubGroupClick={this.handleSubGroupClick}
                    handleLayerClick={this.handleLayerClick}
                    activeGroups={activeGroups}
                    activeSubGroups={activeSubGroups}
                    handleLayerGroupClick={this.handleLayerGroupClick}
                    handleSubLayerGroupClick={this.handleSubLayerGroupClick}
                    subLayers={subLayers}
                    loadingLayers={loadingLayers}
                />
            );
        }

        return <LoadingIcon loading={fetching} />;
    }
}

export default MapLayersActive;
