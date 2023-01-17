// @flow
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { fetchDeleteWorkspace } from '../../../../api/workspace/deleteWorkspace';
import { fetchSaveWorkspace } from '../../../../api/workspace/saveWorkspace';
import { fetchWorkspace } from '../../../../api/workspace/userWorkspace';
import strings from '../../../../translations';
import { createWorkspaceJsonBody } from '../../../../utils/workspace/createWorkspaceJsonBody';
import { loadWorkspace } from '../../../../utils/workspace/loadWorkspace';
import WorkspaceView from './WorkspaceView';
import { copyToClipboard } from '../../../../utils/copyToClipboard';

type Props = {
    setActiveModal: (activeModal: string) => void,
    workspaceList: Array<Object>,
    setWorkspace: Function,
    setWorkspaceRejected: Function,
    layerList: Array<Object>,
    view: Object,
    selectedFeatures: Array<Object>,
    updateWorkspaces: (
        workspaceFetch: Function,
        fetchParam: Object | string,
        type: string) => void,
    showConfirmModal: (
        body: string,
        acceptText: string,
        cancelText: string,
        accept: Function
    ) => void,
    setLayerList: (layerList: Object[]) => void,
    layerLegendActive: boolean,
    toggleLayerLegend: () => void,
    loadingLayers: boolean,
    activateLayers: (layers: Object[], workspace: Object) => void,
    deactivateLayer: (layerId: string) => void,
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
            updateWorkspaces(fetchSaveWorkspace, workspaceJson, 'replace');
        });
    };

    handleDeleteWorkspace = (workspaceName: string) => {
        const { updateWorkspaces, showConfirmModal } = this.props;
        const { body, acceptText, cancelText } = strings.workspace.confirmDelete;

        showConfirmModal(body, acceptText, cancelText, () => {
            updateWorkspaces(fetchDeleteWorkspace, workspaceName, 'delete');
        });
    };

    handleSelectWorkspace = (workspaceName: string, isPublic: boolean) => {
        const {
            setWorkspace,
            setWorkspaceRejected,
            showConfirmModal,
            view,
            layerList,
            updateWorkspaces,
            setLayerList,
            layerLegendActive,
            toggleLayerLegend,
            activateLayers,
            deactivateLayer,
        } = this.props;
        const { body, acceptText, cancelText } = strings.workspace.confirmSelect;

        showConfirmModal(body, acceptText, cancelText, () => {
            setWorkspace();
            view.popup.close();

            // Reset layer renderers to default for layers which user has created theme layers.
            const agfsLayers = layerList.filter(l => l.active && l.type === 'agfs' && l.renderer);
            agfsLayers.forEach((layer) => {
                const featureLayer = view.map.findLayerById(layer.id);
                if (featureLayer) {
                    featureLayer.renderer = layer.renderer;
                    featureLayer.legendEnabled = false;
                }
            });
            const newLayerList = layerList.map(l => ({
                ...l,
                renderer: agfsLayers.find(layer => layer.id === l.id) ? null : l.renderer,
            }));
            setLayerList(newLayerList);

            // Fetches users selected workspace.
            fetchWorkspace(workspaceName, isPublic)
                .then(async (workspace) => {
                    if (workspace) {
                        await loadWorkspace(
                            workspace,
                            newLayerList,
                            view,
                            activateLayers,
                            deactivateLayer,
                            updateWorkspaces,
                        );
                        if (layerLegendActive) toggleLayerLegend();
                    } else {
                        setWorkspaceRejected();
                    }
                })
                .catch((err) => {
                    console.error(err);
                });
        });
    };

    handleShareWorkspace = (workspaceName: string) => {
        const { workspaceList } = this.props;
        const workspace = workspaceList.find(ws => ws.name === workspaceName);

        if (workspace) {
            const { uuid } = workspace;
            const path = window.location.href.split('?')[0];

            copyToClipboard(`${path}?workspace=${uuid}`);
            toast.info(`${strings.workspace.share.copiedWorkspaceLink} [${workspaceName}]`, {
                toastId: 'workspaceCopyClipboard',
            });
            toast.update('workspaceCopyClipboard');
        } else {
            toast.error(strings.workspace.share.linkToClipboardError, {
                toastId: 'workspaceCopyClipboard',
            });
            toast.update('workspaceCopyClipboard');
        }
    };

    render() {
        const { setActiveModal, workspaceList, loadingLayers } = this.props;

        return (
            <WorkspaceView
                setActiveModal={setActiveModal}
                workspaceList={workspaceList}
                handleDeleteWorkspace={this.handleDeleteWorkspace}
                handleReplaceWorkspace={this.handleReplaceWorkspace}
                handleSelectWorkspace={this.handleSelectWorkspace}
                handleShareWorkspace={this.handleShareWorkspace}
                loadingLayers={loadingLayers}
            />
        );
    }
}

export default Workspace;
