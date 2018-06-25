// @flow
import React, { Component } from 'react';
import ModalView from './ModalView';

type State = {
    modalOpen: boolean,
    stateColumns: Array<Object>,
};

type Props = {
    columns: Array<Object>,
    modalOpen: boolean,
    handleModalSubmit: Function,
};

class Modal extends Component<Props, State> {
    constructor(props: any) {
        super(props);

        this.state = {
            modalOpen: false,
            stateColumns: [],
        };

        this.toggleModal = this.toggleModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
    }

    componentDidUpdate(prevProps: any) {
        if (this.props.modalOpen !== prevProps.modalOpen) {
            this.toggleModal();
        }
    }

    loadColumns = () => {
        this.setState({ stateColumns: this.props.columns.map(c => ({ ...c })) });
    };

    toggleModal = () => {
        this.setState({ modalOpen: !this.state.modalOpen });
        if (!this.state.modalOpen) {
            this.loadColumns();
        }
    };

    handleSubmit = () => {
        this.props.handleModalSubmit(this.state.stateColumns);
        this.toggleModal();
    };

    handleOnChange = (name: any) => {
        const { stateColumns } = this.state;
        const stateColumnsChanged = [...stateColumns];
        const objIndex = stateColumns.findIndex((obj => obj.Header === name));
        stateColumnsChanged[objIndex].show = !stateColumnsChanged[objIndex].show;
        this.setState({ stateColumns: stateColumnsChanged });
    };

    render() {
        const { modalOpen, stateColumns } = this.state;

        return (
            <ModalView
                columns={stateColumns}
                modalOpen={modalOpen}
                toggleModal={this.toggleModal}
                handleOnChange={this.handleOnChange}
                handleModalSubmit={this.handleSubmit}
            />
        );
    }
}

export default Modal;
