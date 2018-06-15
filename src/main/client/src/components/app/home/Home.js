// @flow
import React, { Component } from 'react';
import HomeView from './HomeView';

type Props = {
    getLayerGroups: Function,
};

type State = {
    /* ... */
};

class Home extends Component<Props, State> {
    componentDidMount() {
        const { getLayerGroups } = this.props;

        getLayerGroups();
    }

    render() {
        return <HomeView />;
    }
}

export default Home;
