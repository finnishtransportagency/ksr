// @flow
import React, { Component } from 'react';
import HomeView from './HomeView';

type Props = {
    getLayerGroups: Function,
    getMapConfig: Function,
    getWorkspaceList: Function,
};

class Home extends Component<Props, null> {
    componentDidMount() {
        const { getLayerGroups, getMapConfig, getWorkspaceList } = this.props;

        getLayerGroups();
        getMapConfig();
        getWorkspaceList();
    }

    render() {
        return <HomeView />;
    }
}

export default Home;
