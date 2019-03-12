// @flow
import React, { Fragment } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import strings from '../../../../translations/fi';
import SideBar from '../../../ui/blocks/SideBar';
import Workspace from '../../../ui/blocks/Workspace';
import { H1, Button } from '../../../ui/elements';
import { WorkspaceWrapper } from './styles';
import { toDisplayDateTime } from '../../../../utils/date';

type Props = {
    setActiveModal: (activeModal: string) => void,
    workspaceList: Array<Object>,
    handleDeleteWorkspace: Function,
    handleReplaceWorkspace: Function,
    handleSelectWorkspace: Function,
    handleShareWorkspace: Function,
    loadingLayers: boolean,
}

const WorkspaceView = ({
    setActiveModal,
    workspaceList,
    handleDeleteWorkspace,
    handleReplaceWorkspace,
    handleSelectWorkspace,
    handleShareWorkspace,
    loadingLayers,
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
                renderThumbVertical={scrollProps => <div {...scrollProps} className="sidebar-content-scroll-thumb" />}
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
                            <Workspace.Icon
                                onClick={() => handleShareWorkspace(workspace.name)}
                                title={strings.workspace.share.copyWorkspaceLink}
                            >
                                <i className="fas fa-share-alt" />
                            </Workspace.Icon>
                            <Workspace.TextColumn
                                disabled={loadingLayers}
                                onClick={() => (!loadingLayers
                                    && handleSelectWorkspace(workspace.name))}
                                title={`${workspace.name} ${toDisplayDateTime(workspace.updateTime)}`}
                            >
                                <Workspace.Text>{workspace.name}</Workspace.Text>
                                <Workspace.Text>
                                    {toDisplayDateTime(workspace.updateTime)}
                                </Workspace.Text>
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
