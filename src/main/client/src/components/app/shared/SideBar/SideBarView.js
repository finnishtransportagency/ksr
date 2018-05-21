// @flow
import React from 'react';
import SideBar from '../../../ui/blocks/SideBar';
import { H2, Button } from '../../../ui/elements';

type Props = {
    activeNav: string,
}

const SideBarView = ({ activeNav }: Props) => (
    <SideBar active={activeNav}>
        <SideBar.Header>
            <H2>{activeNav}</H2>
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
);

export default SideBarView;
