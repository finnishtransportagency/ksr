// @flow
import React, { Component } from 'react';
import MapLayersAllView from './MapLayersAllView';

type Props = {
    layerGroups: Promise<any>,
};

type State = {
    layerGroups: Array<any>,
    activeGroup: number,
};

const initialState = {
    layerGroups: [],
    activeGroup: 0,
};

class MapLayersActive extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = { ...initialState };

        this.handleGroupClick = this.handleGroupClick.bind(this);
    }

    componentDidMount() {
        this.generateLayerGroups();
    }

    generateLayerGroups() {
        const { layerGroups } = this.props;

        layerGroups.then(r => this.setState({ layerGroups: r }));
    }

    handleGroupClick = (id: number) => {
        const { activeGroup } = this.state;
        if (activeGroup === id) {
            this.setState({ activeGroup: 0 });
        } else {
            this.setState({ activeGroup: id });
        }
    };

    render() {
        const { layerGroups, activeGroup } = this.state;

        return <MapLayersAllView layerGroups={layerGroups} handleGroupClick={this.handleGroupClick} activeGroup={activeGroup} />;
    }
}

export default MapLayersActive;
