// @flow
import React, { Component } from 'react';
import LoadingIcon from '../../../shared/LoadingIcon';
import MapLayersAllView from './MapLayersAllView';
import { reorderLayers } from '../../../../../utils/reorder';
import { getLayerFields } from '../../../../../utils/map';

type Props = {
    layerGroups: Array<any>,
    layerList: any,
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
};

const initialState = {
    activeGroup: 0,
};

class MapLayersActive extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = { ...initialState };

        this.handleGroupClick = this.handleGroupClick.bind(this);
        this.handleLayerClick = this.handleLayerClick.bind(this);
    }

    handleGroupClick = (id: number) => {
        const { activeGroup } = this.state;

        if (activeGroup === id) {
            this.setState({ activeGroup: 0 });
        } else {
            this.setState({ activeGroup: id });
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
            visible: layer.id === foundLayer.id ? !layer.active : layer.active,
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

    render() {
        const { activeGroup } = this.state;
        const { layerGroups, fetching, layerList } = this.props;

        if (!fetching) {
            return (
                <MapLayersAllView
                    layerGroups={layerGroups}
                    layerList={layerList}
                    handleGroupClick={this.handleGroupClick}
                    handleLayerClick={this.handleLayerClick}
                    activeGroup={activeGroup}
                />
            );
        }

        return <LoadingIcon loading={fetching} />;
    }
}

export default MapLayersActive;
