// @flow
import React, { Fragment } from 'react';
import { H1 } from '../../ui/elements/H1';
import { Button } from '../../ui/elements/Button';
import SideBar from '../../ui/blocks/SideBar';
import { H2 } from '../../ui/elements/H2';
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
        <Wrapper>
            <H1>{title}</H1>
        </Wrapper>
    </Fragment>
);

export default HomeView;
