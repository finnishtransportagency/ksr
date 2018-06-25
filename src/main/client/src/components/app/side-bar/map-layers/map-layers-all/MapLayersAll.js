// @flow
import React, { Component } from 'react';
import LoadingIcon from '../../../shared/LoadingIcon';
import MapLayersAllView from './MapLayersAllView';

type Props = {
    layerGroups: Array<any>,
    layerList: Array<any>,
    fetching: boolean,
    setLayerList: (Array<any>) => void,
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
        const { layerList, setLayerList } = this.props;
        const layerListChanged = [...layerList];
        const foundIndex = layerList.findIndex(l => l.id === id);

        layerListChanged[foundIndex].active = !layerListChanged[foundIndex].active;

        setLayerList(layerListChanged);
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
