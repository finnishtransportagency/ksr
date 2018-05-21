// @flow
import React, { Component } from 'react';
import SideNavView from './SideNavView';

type Props = {
    setActiveNav: string => void,
    navActive: {
        active: string,
    },
};

type State = {
    test: string,
};

const initialState = {
    test: 'test',
};

class SideNav extends Component<Props, State> {
    constructor(props: any) {
        super(props);

        this.state = {
            ...initialState,
        };

        this.setActive = this.setActive.bind(this);
    }

    setActive = (selectedNav: string) => {
        this.props.setActiveNav(selectedNav);
    };

    render() {
        const { navActive } = this.props;

        return (
            <SideNavView setActiveNav={this.setActive} navActive={navActive} />
        );
    }
}

export default SideNav;
