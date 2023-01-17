// @flow
import React, { Fragment } from 'react';
import { WorkspaceTitle } from '../styles';
import Workspace from '../../../../ui/blocks/Workspace';
import strings from '../../../../../translations/fi';
import { toDisplayDateTime } from '../../../../../utils/date';

type Props = {
    workspaceList: Array<Object>,
    handleDeleteWorkspace: Function,
    handleReplaceWorkspace: Function,
    handleSelectWorkspace: Function,
    handleShareWorkspace: Function,
    loadingLayers: boolean,
}

function UserWorkspacesView({
    workspaceList,
    handleDeleteWorkspace,
    handleReplaceWorkspace,
    handleSelectWorkspace,
    handleShareWorkspace,
    loadingLayers,
}: Props) {
    return (
        <>
            <WorkspaceTitle extraPadding>{strings.workspace.titleUserWorkspace}</WorkspaceTitle>
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
                        userWorkspace
                        disabled={loadingLayers}
                        onClick={() => (!loadingLayers
                            && handleSelectWorkspace(workspace.name, false))}
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
        </>
    );
}

export default UserWorkspacesView;
