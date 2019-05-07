// @flow
import React, { Fragment } from 'react';

import SideBar from '../../../ui/blocks/SideBar';
import EditsContainer from './edits/EditsContainer';
import { H1 } from '../../../ui/elements';
import strings from '../../../../translations/fi';

const OfflineView = () => (
    <Fragment>
        <SideBar.Header>
            <H1>{strings.offline.title}</H1>
        </SideBar.Header>
        <SideBar.Content>
            <EditsContainer />
        </SideBar.Content>
    </Fragment>
);

export default OfflineView;
