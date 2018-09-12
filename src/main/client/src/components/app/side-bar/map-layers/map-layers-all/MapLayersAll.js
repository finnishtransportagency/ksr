// @flow
import React, { Component } from 'react';
import LoadingIcon from '../../../shared/LoadingIcon';
import MapLayersAllView from './MapLayersAllView';

type Props = {
    layerGroups: Array<any>,
    layerList: any,
    fetching: boolean,
    setLayerList: (Array<any>) => void,
    activeAdminTool: string,
    setActiveAdminTool: (layerId: string, layerList: Array<any>) => void,
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
        const { setLayerList, activeAdminTool, setActiveAdminTool } = this.props;
        const layerList = [...this.props.layerList];
        const foundLayer = layerList.find(l => l.id === id);

        if (foundLayer.id === activeAdminTool) setActiveAdminTool('', layerList);
        foundLayer.active = !foundLayer.active;
        setLayerList(layerList);
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
