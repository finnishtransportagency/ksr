import React, { Fragment } from 'react';
import strings from '../../../../translations';
import { H1, Button } from '../../../ui/elements';
import SideBar from '../../../ui/blocks/SideBar';

const SearchView = () => (
    <Fragment>
        <SideBar.Header>
            <H1>{strings.search.title}</H1>
        </SideBar.Header>
        <SideBar.Content>
            <input type="text" />
            <br />
            <Button>{strings.search.buttonSearch}</Button>
        </SideBar.Content>
    </Fragment>
);

export default SearchView;
