// @flow
import React, { Fragment } from 'react';
import { H1, Button, H2 } from '../../ui/elements';
import SideBar from '../../ui/blocks/SideBar';
import SideNavView from '../shared/SideNav/SideNavView';
import { Wrapper } from './styles';

type Props = {
    title: string,
};

const HomeView = ({ title }: Props) => (
    <Fragment>
        <SideNavView />
        <SideBar>
            <SideBar.Header>
                <H2>Karttatasot</H2>
                <span>
                    <i className="fas fa-times" />
                </span>
            </SideBar.Header>
            <SideBar.Content>
                <Button>nappula</Button>
                <Button>nappula</Button>
                <Button>nappula</Button>
            </SideBar.Content>
        </SideBar>
    </Fragment>
);

export default HomeView;
