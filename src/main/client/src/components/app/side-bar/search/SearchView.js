import React, { Fragment } from 'react';
import { H1, Button } from '../../../ui/elements';
import SideBar from '../../../ui/blocks/SideBar';

const SearchView = () => (
    <Fragment>
        <SideBar.Header>
            <H1>Haku</H1>
        </SideBar.Header>
        <SideBar.Content>
            <p>Lorem ipsum dolor sit amet.</p>
            <input type="text" />
            <Button>Hae</Button>
        </SideBar.Content>
    </Fragment>
);

export default SearchView;
