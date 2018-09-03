// @flow
import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import ModalView from './ModalView';

const modalRoot: any = document.getElementById('modal-root');

type Props = {
    title: string,
    submitText: string,
    cancelText: string,
    children: any,
    handleModalSubmit: Function,
    handleModalCancel?: Function,
    activeModal: string,
    setActiveModal: (modal: string) => void,
    submitDisabled: boolean,
};

type State = {
    fadeOut: boolean,
};

const initialState = {
    fadeOut: false,
};

class Modal extends Component<Props, State> {
    static defaultProps = {
        submitDisabled: false,
        handleModalCancel: undefined,
    };

    constructor(props: any) {
        super(props);

        this.state = { ...initialState };

        this.toggleModal = this.toggleModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    toggleModal = () => {
        const { activeModal, setActiveModal } = this.props;

        this.setState({ fadeOut: true });
        setTimeout(() => {
            if (activeModal) setActiveModal('');
        }, 300);
    };

    handleCancel = () => {
        const { handleModalCancel } = this.props;
        if (handleModalCancel) handleModalCancel();
        this.toggleModal();
    };

    handleSubmit = () => {
        const { handleModalSubmit } = this.props;

        handleModalSubmit();
        this.toggleModal();
    };

    render() {
        const {
            title,
            submitText,
            cancelText,
            children,
            activeModal,
            submitDisabled,
        } = this.props;
        const { fadeOut } = this.state;

        if (activeModal) {
            return createPortal(
                <ModalView
                    content={children}
                    title={title}
                    submitText={submitText}
                    cancelText={cancelText}
                    handleModalSubmit={this.handleSubmit}
                    submitDisabled={submitDisabled}
                    fadeOut={fadeOut}
                    handleModalCancel={this.handleCancel}
                />,
                modalRoot,
            );
        }

        return null;
    }
}

export default Modal;
