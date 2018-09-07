// @flow
import React, { Component } from 'react';
import { fetchDeleteWorkspace } from '../../../../api/workspace/deleteWorkspace';
import { fetchSaveWorkspace } from '../../../../api/workspace/saveWorkspace';
import strings from '../../../../translations/';
import { createWorkspaceJsonBody } from '../../../../utils/workspace/createWorkspaceJsonBody';
import WorkspaceView from './WorkspaceView';

type Props = {
    setActiveModal: (activeModal: string) => void,
    workspaceList: Array<Object>,
    getWorkspaceList: Function,
    layerList: Array<Object>,
    view: Object,
    selectedFeatures: Array<Object>,
    showConfirmModal: (
        body: string,
        acceptText: string,
        cancelText: string,
        accept: Function
    ) => void,
};

class Workspace extends Component<Props, null> {
    constructor(props: Props) {
        super(props);

        this.handleReplaceWorkspace = this.handleReplaceWorkspace.bind(this);
        this.handleDeleteWorkspace = this.handleDeleteWorkspace.bind(this);
    }

    handleReplaceWorkspace = (workspaceName: string) => {
        const {
            getWorkspaceList,
            layerList,
            view,
            selectedFeatures,
            showConfirmModal,
        } = this.props;

        const workspaceJson = createWorkspaceJsonBody(
            workspaceName,
            layerList,
            view,
            selectedFeatures,
        );

        const { body, acceptText, cancelText } = strings.workspace.confirmReplace;
        showConfirmModal(body, acceptText, cancelText, () => {
            fetchSaveWorkspace(workspaceJson)
                .then(setTimeout(() => {
                    getWorkspaceList();
                }, 500));
        });
    };

    handleDeleteWorkspace = (workspaceName: string) => {
        const { getWorkspaceList, showConfirmModal } = this.props;
        const { body, acceptText, cancelText } = strings.workspace.confirmDelete;

        showConfirmModal(body, acceptText, cancelText, () => {
            fetchDeleteWorkspace(workspaceName)
                .then(() => {
                    getWorkspaceList();
                });
        });
    };

    render() {
        const { setActiveModal, workspaceList } = this.props;

        return (
            <WorkspaceView
                setActiveModal={setActiveModal}
                workspaceList={workspaceList}
                handleDeleteWorkspace={this.handleDeleteWorkspace}
                handleReplaceWorkspace={this.handleReplaceWorkspace}
            />
        );
    }
}

export default Workspace;
