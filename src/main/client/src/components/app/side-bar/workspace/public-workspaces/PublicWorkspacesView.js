// @flow
import React, { Fragment } from 'react';
import Workspace from '../../../../ui/blocks/Workspace';
import { WorkspaceTitle } from '../styles';
import strings from '../../../../../translations/fi';

type Props = {
    workspaceList: Array<Object>,
    handleSelectWorkspace: Function,
    loadingLayers: boolean,
}

function PublicWorkspacesView({
    workspaceList,
    handleSelectWorkspace,
    loadingLayers,
}: Props): React$Element<React$FragmentType> {
    return (
        <>
            <WorkspaceTitle>{strings.workspace.titlePublicWorkspace}</WorkspaceTitle>
            {workspaceList.map(workspace => (
                <Workspace key={workspace.name}>
                    <Workspace.TextColumn
                        publicWorkspace
                        disabled={loadingLayers}
                        onClick={() => (!loadingLayers
                            && handleSelectWorkspace(workspace.name, true))}
                        title={workspace.name}
                    >
                        <Workspace.Text>{workspace.name}</Workspace.Text>
                    </Workspace.TextColumn>
                </Workspace>
            ))}
        </>
    );
}

export default PublicWorkspacesView;
