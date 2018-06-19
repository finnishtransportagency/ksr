// @flow
import React, { Component } from 'react';
import HomeView from './HomeView';

type Props = {
    getLayerGroups: Function,
    getMapConfig: Function,
};

type State = {
    /* ... */
};

class Home extends Component<Props, State> {
    componentDidMount() {
        const { getLayerGroups, getMapConfig } = this.props;

        getLayerGroups();
        getMapConfig();
    }

    render() {
        return <HomeView />;
    }
}

export default Home;
