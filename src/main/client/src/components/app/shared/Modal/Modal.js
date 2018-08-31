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
    submitDisabled: boolean,
};

class Modal extends Component<Props> {
    static defaultProps = {
        submitDisabled: false,
    };

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
            submitDisabled,
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
                    submitDisabled={submitDisabled}
                />,
                modalRoot,
            );
        }

        return null;
    }
}

export default Modal;
