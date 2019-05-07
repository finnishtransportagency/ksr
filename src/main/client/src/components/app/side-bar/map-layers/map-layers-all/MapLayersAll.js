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
    layersToFind: string,
    activeGroups: number[],
    activeSubGroups: number[],
    setActiveGroups: (activeGroups: number[]) => void,
    setActiveSubGroups: (activeSubGroups: number[]) => void,
    setSearchFeatures: (layers: Object[]) => void,
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
        const {
            activateLayers, deactivateLayer, layerList, setSearchFeatures,
        } = this.props;
        const foundLayer = layerList.find(l => l.id === id);
        if (foundLayer && !foundLayer.active) {
            if (foundLayer.definitionExpression) {
                setSearchFeatures([foundLayer]);
            }
            activateLayers([foundLayer]);
        } else {
            deactivateLayer(foundLayer.id);
        }
    };

    handleLayerGroupClick = (layerGroupName: string) => {
        const { layerList, layersToFind, subLayers } = this.props;
        const foundLayers = layerList.filter(l => (
            l.layerGroupName === layerGroupName
            && !l.parentLayer
            && l.relationType !== 'link'
            && l._source !== 'shapefile'
            && (layersToFind
                ? (l.layerGroupName.toLowerCase().includes(layersToFind)
                    || l.name.toLowerCase().includes(layersToFind)
                    || subLayers.some(layer => layer.parentLayer === l.id
                        && layer.name.toLowerCase().includes(layersToFind)))
                : true)));

        this.updateLayerList(foundLayers);
    };

    handleSubLayerGroupClick = (id: number) => {
        const { subLayers, layerList, layersToFind } = this.props;
        const parentLayer = layerList.find(l => l.id === id);
        const filteredSubLayers = parentLayer
            ? [parentLayer, ...subLayers.filter(l => l.parentLayer === id
                && (layersToFind
                    ? (l.name.toLowerCase().includes(layersToFind)
                        || parentLayer.name.toLowerCase().includes(layersToFind)
                        || parentLayer.layerGroupName.toLowerCase().includes(layersToFind))
                    : true))]
            : [];

        this.updateLayerList(filteredSubLayers);
    };

    updateLayerList = (foundLayers: Object[]) => {
        const {
            activateLayers, deactivateLayer, loadingLayers, setSearchFeatures,
        } = this.props;
        const active = foundLayers.filter(f => !f.failOnLoad).length > 0
            ? foundLayers.filter(f => !f.failOnLoad).every(l => l.active)
            : foundLayers.every(l => l.active);

        if (active) {
            foundLayers.forEach(foundLayer => deactivateLayer(foundLayer.id));
        } else {
            const searchLayers = foundLayers.filter(foundLayer => (
                !foundLayer.active && !loadingLayers.some(layerId => layerId === foundLayer.id)
                && foundLayer.definitionExpression
            ));
            if (searchLayers.length) {
                setSearchFeatures(searchLayers);
            }

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
            layersToFind,
            activeGroups,
            activeSubGroups,
        } = this.props;

        let newLayerList = [];
        let layersToFindTrimmed = '';
        if (layersToFind) {
            layersToFindTrimmed = layersToFind.trim().toLowerCase();
            newLayerList = layerGroups.map(group => (
                {
                    ...group,
                    layers: group.name.toLowerCase().includes(layersToFindTrimmed)
                        ? group.layers
                        : group.layers.filter(layer => layer.relationType !== 'link')
                            .filter(layer => layer.name.toLowerCase().includes(layersToFindTrimmed)
                            || subLayers.find(subLayer => subLayer.name
                                .toLowerCase().includes(layersToFindTrimmed)
                                && subLayer.parentLayer === layer.id)),
                }
            ));
        }

        if (!fetching) {
            return (
                <MapLayersAllView
                    layerGroups={newLayerList.length ? newLayerList : layerGroups}
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
                    layersToFind={layersToFindTrimmed}
                />
            );
        }

        return <LoadingIcon loading={fetching} />;
    }
}

export default MapLayersActive;
