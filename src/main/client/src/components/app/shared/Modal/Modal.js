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
    activeModal: string,
    setActiveModal: (modal: string) => void,
};

class Modal extends Component<Props> {
    constructor(props: any) {
        super(props);

        this.toggleModal = this.toggleModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    toggleModal = () => {
        const { activeModal, setActiveModal } = this.props;

        if (activeModal) setActiveModal('');
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
        } = this.props;

        if (activeModal) {
            return createPortal(
                <ModalView
                    content={children}
                    title={title}
                    submitText={submitText}
                    cancelText={cancelText}
                    toggleModal={this.toggleModal}
                    handleModalSubmit={this.handleSubmit}
                />,
                modalRoot,
            );
        }

        return null;
    }
}

export default Modal;
