// @flow
import React, { Component } from 'react';
import strings from '../../../../translations';
import ModalContainer from '../../shared/Modal/ModalContainer';
import ModalDeleteSelectedView from './ModalDeleteSelectedView';

type Props = {
    selectedData: Array<Object>,
    filteredData: Array<Object>,
    deleteSelectedData: (selectedData: Array<Object>, deleteComment: string) => void,
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

    render() {
        const { selectedData, filteredData, deleteSelectedData } = this.props;
        const { deleteComment } = this.state;

        return (
            <ModalContainer
                title={strings.modalDeleteSelected.title}
                handleModalSubmit={() => { deleteSelectedData(selectedData, deleteComment); }}
                submitText={strings.modalDeleteSelected.submit}
                cancelText={strings.modalDeleteSelected.cancel}
            >
                <ModalDeleteSelectedView
                    selectedData={selectedData}
                    deleteComment={deleteComment}
                    handleTextareaChange={this.handleTextareaChange}
                    filteredData={filteredData}
                />
            </ModalContainer>
        );
    }
}

export default ModalDeleteSelected;
