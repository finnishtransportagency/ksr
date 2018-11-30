// @flow
import React, { Component } from 'react';
import { fetchDeleteWorkspace } from '../../../../api/workspace/deleteWorkspace';
import { fetchSaveWorkspace } from '../../../../api/workspace/saveWorkspace';
import { fetchWorkspace } from '../../../../api/workspace/userWorkspace';
import strings from '../../../../translations/';
import { createWorkspaceJsonBody } from '../../../../utils/workspace/createWorkspaceJsonBody';
import { loadWorkspace } from '../../../../utils/workspace/loadWorkspace';
import WorkspaceView from './WorkspaceView';

type Props = {
    setActiveModal: (activeModal: string) => void,
    workspaceList: Array<Object>,
    updateWorkspaces: Function,
    setWorkspace: Function,
    setWorkspaceRejected: Function,
    addNonSpatialContentToTable: Function,
    selectFeatures: Function,
    searchWorkspaceFeatures: Function,
    layerList: Array<Object>,
    view: Object,
    selectedFeatures: Array<Object>,
    updateWorkspaces: Function,
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
        this.handleSelectWorkspace = this.handleSelectWorkspace.bind(this);
    }

    handleReplaceWorkspace = (workspaceName: string) => {
        const {
            layerList,
            view,
            selectedFeatures,
            showConfirmModal,
            updateWorkspaces,
        } = this.props;

        const workspaceJson = createWorkspaceJsonBody(
            workspaceName,
            layerList,
            view,
            selectedFeatures,
        );

        const { body, acceptText, cancelText } = strings.workspace.confirmReplace;
        showConfirmModal(body, acceptText, cancelText, () => {
            updateWorkspaces(fetchSaveWorkspace, workspaceJson);
        });
    };

    handleDeleteWorkspace = (workspaceName: string) => {
        const { updateWorkspaces, showConfirmModal } = this.props;
        const { body, acceptText, cancelText } = strings.workspace.confirmDelete;

        showConfirmModal(body, acceptText, cancelText, () => {
            updateWorkspaces(fetchDeleteWorkspace, workspaceName);
        });
    };

    handleSelectWorkspace = (workspaceName: string) => {
        const {
            setWorkspace,
            setWorkspaceRejected,
            showConfirmModal,
            view,
            layerList,
            selectFeatures,
            searchWorkspaceFeatures,
            updateWorkspaces,
            addNonSpatialContentToTable,
        } = this.props;
        const { body, acceptText, cancelText } = strings.workspace.confirmSelect;

        showConfirmModal(body, acceptText, cancelText, () => {
            setWorkspace();

            // Fetches users selected workspace.
            fetchWorkspace(workspaceName)
                .then((workspace) => {
                    if (workspace) {
                        loadWorkspace(
                            workspace,
                            layerList,
                            view,
                            searchWorkspaceFeatures,
                            addNonSpatialContentToTable,
                            selectFeatures,
                            updateWorkspaces,
                        );
                    } else {
                        setWorkspaceRejected();
                    }
                })
                .catch((err) => {
                    console.log(err);
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
                handleSelectWorkspace={this.handleSelectWorkspace}
            />
        );
    }
}

export default Workspace;
