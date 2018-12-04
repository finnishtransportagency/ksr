// @flow
import React, { Component } from 'react';
import LoadingIcon from '../../../shared/LoadingIcon';
import MapLayersAllView from './MapLayersAllView';
import { reorderLayers } from '../../../../../utils/reorder';

type Props = {
    layerGroups: Array<any>,
    layerList: any,
    fetching: boolean,
    setLayerList: (Array<any>) => void,
    activeAdminTool: string,
    setActiveAdminTool: (layerId: string, layerList: Array<any>) => void,
    addNonSpatialContentToTable: Object => void,
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

    handleLayerClick = (id: number) => {
        const {
            setLayerList, activeAdminTool, setActiveAdminTool, layerGroups,
        } = this.props;
        let layerList = [...this.props.layerList];
        const foundLayer = layerList.find(l => l.id === id);

        if (foundLayer.id === activeAdminTool) setActiveAdminTool('', layerList);

        if (!foundLayer.active) layerList = reorderLayers(layerGroups, layerList, foundLayer);
        foundLayer.active = !foundLayer.active;
        foundLayer.visible = true;
        setLayerList(layerList);

        if (foundLayer.type === 'agfl' && foundLayer.active) {
            this.props.addNonSpatialContentToTable(foundLayer);
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
