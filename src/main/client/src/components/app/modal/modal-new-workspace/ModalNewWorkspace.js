// @flow
import React, { Component } from 'react';
import { fetchWorkspaceNameExists } from '../../../../api/workspace/nameExists';
import { fetchSaveWorkspace } from '../../../../api/workspace/saveWorkspace';
import strings from '../../../../translations/fi';
import { createWorkspaceJsonBody } from '../../../../utils/workspace/createWorkspaceJsonBody';
import ModalContainer from '../../shared/Modal/ModalContainer';
import ModalNewWorkspaceView from './ModalNewWorkspaceView';

type Props = {
    view: Object,
    layerList: Array<Object>,
    selectedFeatures: Array<Object>,
    getWorkspaceList: Function,
};

type State = {
    workspaceName: string,
    submitDisabled: boolean,
    fetching: boolean,
};

const initialState = {
    workspaceName: '',
    submitDisabled: true,
    fetching: false,
};

class ModalNewWorkspace extends Component<Props, State> {
    abortController: ?Object = null; // eslint-disable-line react/sort-comp
    existsQuery: ?number = 0; // eslint-disable-line react/sort-comp

    constructor(props: Props) {
        super(props);

        this.state = { ...initialState };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange = (evt: Object) => {
        const workspaceName = evt.target.value;

        window.clearTimeout(this.existsQuery);
        if (this.abortController) this.abortController.abort();

        this.setState({ workspaceName });

        if (workspaceName.trim()) {
            this.setState({
                submitDisabled: true,
                fetching: true,
            });

            this.existsQuery = window.setTimeout(() => {
                const signal = this.abortController ? this.abortController.signal : undefined;

                fetchWorkspaceNameExists(
                    workspaceName.trim(),
                    signal,
                ).then((r) => {
                    this.setState({
                        submitDisabled: r,
                        fetching: false,
                    });
                });
            }, 300);
        }
    };

    handleSubmit = () => {
        const {
            layerList,
            view,
            selectedFeatures,
            getWorkspaceList,
        } = this.props;
        const { workspaceName } = this.state;

        const workspaceJson = createWorkspaceJsonBody(
            workspaceName.trim(),
            layerList,
            view,
            selectedFeatures,
        );

        fetchSaveWorkspace(workspaceJson)
            .then(setTimeout(() => {
                getWorkspaceList();
            }, 500));
    };

    render() {
        const { workspaceName, submitDisabled, fetching } = this.state;

        return (
            <ModalContainer
                submitDisabled={!workspaceName.trim() || submitDisabled || fetching}
                title={strings.modalNewWorkspace.title}
                handleModalSubmit={this.handleSubmit}
                submitText={strings.modalNewWorkspace.submit}
                cancelText={strings.modalNewWorkspace.cancel}
            >
                <ModalNewWorkspaceView
                    handleInputChange={this.handleInputChange}
                    workspaceName={workspaceName}
                    submitDisabled={submitDisabled}
                    fetching={fetching}
                />
            </ModalContainer>
        );
    }
}

export default ModalNewWorkspace;
