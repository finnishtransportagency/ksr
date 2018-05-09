// @flow
import React, { Component } from 'react';
import HomeView from './HomeView';

type State = {
    title: string,
};

class Home extends Component<void, State> {
    constructor(props: any) {
        super(props);

        this.state = {
            title: 'ksr',
        };
    }

    render() {
        const { title } = this.state;

        return <HomeView title={title} />;
    }
}

export default Home;
