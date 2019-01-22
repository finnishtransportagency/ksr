// @flow
import React, { Component } from 'react';
import LoadingIcon from '../../../shared/LoadingIcon';
import MapLayersAllView from './MapLayersAllView';
import { reorderLayers } from '../../../../../utils/reorder';
import { getLayerFields } from '../../../../../utils/map';

type Props = {
    layerGroups: Array<any>,
    layerList: any,
    subLayers: Object[],
    fetching: boolean,
    setLayerList: (Array<any>) => void,
    activeAdminTool: string,
    view: Object,
    setActiveAdminTool: (layerId: string, layerList: Array<any>) => void,
    addNonSpatialContentToTable: Object => void,
    setLoading: Function,
    removeLoading: Function,
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

    handleLayerClick = async (id: number) => {
        const {
            setLayerList,
            activeAdminTool,
            setActiveAdminTool,
            layerGroups,
            view,
            addNonSpatialContentToTable,
            setLoading,
            removeLoading,
        } = this.props;

        let layerList = [...this.props.layerList];
        const foundLayer = layerList.find(l => l.id === id);
        view.popup.close();

        if (foundLayer.id === activeAdminTool) setActiveAdminTool('', layerList);

        layerList = layerList.map(layer => ({
            ...layer,
            active: layer.id === foundLayer.id ? !layer.active : layer.active,
            visible: layer.id === foundLayer.id ? !layer.visible : layer.visible,
        }));
        layerList = reorderLayers(layerGroups, layerList, foundLayer);

        if (!foundLayer.active) {
            if (foundLayer.type === 'agfl') {
                setLoading();
                layerList = await getLayerFields(layerList, [foundLayer]);
                removeLoading();
                setLayerList(layerList);
                addNonSpatialContentToTable(foundLayer);
            } else {
                setLoading(); // Loading should be removed after layer has been added to map.
                layerList = await getLayerFields(layerList, [foundLayer]);
                setLayerList(layerList);
            }
        } else {
            setLayerList(layerList);
        }
    };

    handleLayerGroupClick = async (layerGroupName: string) => {
        const {
            setLayerList,
            layerGroups,
            addNonSpatialContentToTable,
        } = this.props;
        const layerList = [...this.props.layerList];
        const foundLayers = layerList.filter(l =>
            l.layerGroupName === layerGroupName &&
            l.relationType !== 'link');

        await this.updateLayerList(
            foundLayers,
            [...this.props.layerList],
            layerGroups,
            addNonSpatialContentToTable,
            setLayerList,
        );
    };

    handleSubLayerGroupClick = async (id: number) => {
        const {
            setLayerList,
            layerGroups,
            subLayers,
            addNonSpatialContentToTable,
        } = this.props;
        const layerList = [...this.props.layerList];
        const parentLayer = layerList.filter(l => l.id === id);
        const filteredSublayers = subLayers.filter(l => l.parentLayer === id);
        const foundLayers = [...new Set([...parentLayer, ...filteredSublayers])];

        await this.updateLayerList(
            foundLayers,
            layerList,
            layerGroups,
            addNonSpatialContentToTable,
            setLayerList,
        );
    };

    updateLayerList = async (
        foundLayers: Object[],
        layerList: Object[],
        layerGroups: Object[],
        addNonSpatialContentToTable: Function,
        setLayerList: Function,
    ) => {
        const active = foundLayers.every(l => l.active);
        let modifiedLayerList = layerList.map(layer => ({
            ...layer,
            active: foundLayers.find(f => f.id === layer.id) ? !active : layer.active,
            visible: foundLayers.find(f => f.id === layer.id) ? !active : layer.visible,
        }));

        modifiedLayerList = await getLayerFields(modifiedLayerList, foundLayers);

        await foundLayers.forEach(async (l) => {
            if (!l.active) {
                modifiedLayerList = reorderLayers(layerGroups, modifiedLayerList, l);
                if (l.type === 'agfl') {
                    addNonSpatialContentToTable(l);
                }
            }
        });
        setLayerList(modifiedLayerList);
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
