// @flow
import React, { Fragment } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import strings from '../../../../translations/fi';
import SideBar from '../../../ui/blocks/SideBar';
import { H1, Button } from '../../../ui/elements';
import { WorkspaceWrapper } from './styles';
import PublicWorkspacesView from './public-workspaces/PublicWorkspacesView';
import UserWorkspacesView from './user-workspaces/UserWorkspacesView';

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
            <Scrollbars
                autoHide
                style={{
                    height: 'calc(100% - 150px)',
                }}
                renderThumbVertical={scrollProps => <div {...scrollProps} className="sidebar-content-scroll-thumb" />}
            >
                <WorkspaceWrapper>
                    <PublicWorkspacesView
                        workspaceList={workspaceList
                            .filter(workspace => workspace.isPublic)
                            .sort((a, b) => a.name.localeCompare(b.name))}
                        handleSelectWorkspace={handleSelectWorkspace}
                        loadingLayers={loadingLayers}
                    />
                    <UserWorkspacesView
                        workspaceList={workspaceList.filter(workspace => !workspace.isPublic)}
                        handleDeleteWorkspace={handleDeleteWorkspace}
                        handleReplaceWorkspace={handleReplaceWorkspace}
                        handleSelectWorkspace={handleSelectWorkspace}
                        handleShareWorkspace={handleShareWorkspace}
                        loadingLayers={loadingLayers}
                        setActiveModal={setActiveModal}
                    />
                </WorkspaceWrapper>
            </Scrollbars>
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
