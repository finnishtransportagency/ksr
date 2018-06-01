// @flow
import React, { Fragment } from 'react';
import SideBar from '../../../ui/blocks/SideBar';
import { H1, H2, Button } from '../../../ui/elements';
import { Wrapper } from './styles';

type Props = {
    layerGroups: Array<any>,
}

const MapLayersView = ({ layerGroups }: Props) => (
    <Wrapper>
        <SideBar.Header>
            <H1>Karttatasot</H1>
        </SideBar.Header>
        <SideBar.Content>
            <Button disabled>Aktiiviset</Button>
            <Button>Kaikki</Button>
            <H2>{ layerGroups.map(lg => lg.name) }</H2>
            { layerGroups.map(lg => lg.layers.map(l => <div key={l.id}><input checked={l.visible} type="checkbox" /><span>{l.name}</span></div>)) }
        </SideBar.Content>
    </Wrapper>
);

export default MapLayersView;
