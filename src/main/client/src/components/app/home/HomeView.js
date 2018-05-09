// @flow
import React from 'react';
import { H1 } from '../../ui/elements/H1';
import { Wrapper } from './styles';

type Props = {
    title: string,
};

const HomeView = ({ title }: Props) => (
    <Wrapper>
        <H1>{title}</H1>
    </Wrapper>
);

export default HomeView;
