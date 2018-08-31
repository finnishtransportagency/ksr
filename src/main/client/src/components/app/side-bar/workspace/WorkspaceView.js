// @flow
import React, { Fragment } from 'react';
import strings from '../../../../translations/fi';
import SideBar from '../../../ui/blocks/SideBar';
import { H1, Button } from '../../../ui/elements';
import { WorkspaceWrapper } from './styles';

type Props = {
    setActiveModal: (activeModal: string) => void,
}

const WorkspaceView = ({ setActiveModal }: Props) => (
    <Fragment>
        <SideBar.Header>
            <H1>{strings.workspace.title}</H1>
        </SideBar.Header>
        <SideBar.Content>
            <WorkspaceWrapper>
                <Button
                    onClick={() => setActiveModal('newWorkspace')}
                >
                    {strings.workspace.newWorkspace}
                </Button>
            </WorkspaceWrapper>
        </SideBar.Content>
    </Fragment>
);

export default WorkspaceView;
