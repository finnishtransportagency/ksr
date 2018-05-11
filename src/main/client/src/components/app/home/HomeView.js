// @flow
import React, { Fragment } from 'react';
import { H1 } from '../../ui/elements/H1';
import SideNavView from '../shared/SideNav/SideNavView';
import { Wrapper } from './styles';

type Props = {
    title: string,
};

const HomeView = ({ title }: Props) => (
    <Fragment>
        <SideNavView />
        <Wrapper>
            <H1>{title}</H1>
        </Wrapper>
    </Fragment>
);

export default HomeView;
