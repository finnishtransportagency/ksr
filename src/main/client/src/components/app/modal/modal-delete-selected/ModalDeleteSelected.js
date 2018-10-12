// @flow
import React, { Component } from 'react';
import strings from '../../../../translations';
import ModalContainer from '../../shared/Modal/ModalContainer';
import ModalDeleteSelectedView from './ModalDeleteSelectedView';

type Props = {
    filteredData: Array<Object>,
    view: Object,
    layerId: string,
    saveDeletedFeatures: (
        view: Object,
        layerId: string,
        objectIds: string,
        deleteComment: string
    ) => void,
};

type State = {
    deleteComment: string,
};

const initialState = {
    deleteComment: '',
};

class ModalDeleteSelected extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = { ...initialState };

        this.handleTextareaChange = this.handleTextareaChange.bind(this);
    }

    handleTextareaChange = (e: Object) => {
        this.setState({ deleteComment: e.target.value });
    };

    handleFeatureDelete = () => {
        const {
            view,
            filteredData,
            saveDeletedFeatures,
            layerId,
        } = this.props;
        const { deleteComment } = this.state;

        const objectIds = filteredData
            .map(fd => fd._id)
            .join(', ');

        saveDeletedFeatures(view, layerId.replace('.s', ''), objectIds, deleteComment);
    };

    render() {
        const { filteredData } = this.props;
        const { deleteComment } = this.state;

        return (
            <ModalContainer
                title={strings.modalDeleteSelected.title}
                handleModalSubmit={() => { this.handleFeatureDelete(); }}
                submitText={strings.modalDeleteSelected.submit}
                cancelText={strings.modalDeleteSelected.cancel}
            >
                <ModalDeleteSelectedView
                    deleteComment={deleteComment}
                    handleTextareaChange={this.handleTextareaChange}
                    filteredData={filteredData}
                />
            </ModalContainer>
        );
    }
}

export default ModalDeleteSelected;
