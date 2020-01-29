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

const PublicWorkspacesView = ({
    workspaceList,
    handleSelectWorkspace,
    loadingLayers,
}: Props) => (
    <Fragment>
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
    </Fragment>
);

export default PublicWorkspacesView;
