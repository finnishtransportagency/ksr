// @flow
import React, { Fragment } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import strings from '../../../../translations/fi';
import SideBar from '../../../ui/blocks/SideBar';
import Workspace from '../../../ui/blocks/Workspace';
import { H1, Button } from '../../../ui/elements';
import { WorkspaceWrapper } from './styles';

type Props = {
    setActiveModal: (activeModal: string) => void,
    workspaceList: Array<Object>,
    handleDeleteWorkspace: Function,
    handleReplaceWorkspace: Function,
    handleSelectWorkspace: Function,
}

const WorkspaceView = ({
    setActiveModal,
    workspaceList,
    handleDeleteWorkspace,
    handleReplaceWorkspace,
    handleSelectWorkspace,
}: Props) => (
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
            <Scrollbars
                autoHide
                style={{ height: 'calc(100% - 150px)' }}
                renderThumbVertical={scrollProps =>
                    <div {...scrollProps} className="sidebar-content-scroll-thumb" />}
            >
                <WorkspaceWrapper>
                    {workspaceList.map(workspace => (
                        <Workspace key={workspace.name}>
                            <Workspace.Icon
                                onClick={() => handleReplaceWorkspace(workspace.name)}
                                title={strings.workspace.replaceWorkspace}
                            >
                                <i className="fas fa-save" />
                            </Workspace.Icon>
                            <Workspace.TextColumn
                                onClick={() => handleSelectWorkspace(workspace.name)}
                                title={`${workspace.name} ${workspace.updated}`}
                            >
                                <Workspace.Text>{workspace.name}</Workspace.Text>
                                <Workspace.Text>{workspace.updated}</Workspace.Text>
                            </Workspace.TextColumn>
                            <Workspace.Icon
                                onClick={() => handleDeleteWorkspace(workspace.name)}
                                title={strings.workspace.deleteWorkspace}
                            >
                                <i className="fas fa-trash" />
                            </Workspace.Icon>
                        </Workspace>
                    ))}
                </WorkspaceWrapper>
            </Scrollbars>
        </SideBar.Content>
    </Fragment>
);

export default WorkspaceView;
