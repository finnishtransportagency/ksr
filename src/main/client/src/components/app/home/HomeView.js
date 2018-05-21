// @flow
import React, { Fragment } from 'react';
import { Button, H2 } from '../../ui/elements';
import SideBar from '../../ui/blocks/SideBar';
import SideNavContainer from '../shared/SideNav/SideNavContainer';

const HomeView = () => (
    <Fragment>
        <SideNavView />
        <EsriMap />
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
