// @flow
import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import ModalView from './ModalView';

const modalRoot: any = document.getElementById('modal-root');

type ModalSubmit = {
    text: string,
    handleSubmit: Function,
    disabled: boolean,
    toggleModal: boolean,
};

type Props = {
    title: string,
    modalSubmit: ModalSubmit[],
    cancelText: string,
    children: any,
    handleModalCancel?: Function,
    handleGoBack?: any,
    activeModal: string,
    setActiveModal: (modal: string) => void,
};

type State = {
    fadeOut: boolean,
};

const initialState = {
    fadeOut: false,
};

class Modal extends Component<Props, State> {
    static defaultProps = {
        handleModalCancel: undefined,
        handleGoBack: undefined,
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

    handleSubmit = (index: number) => {
        const { modalSubmit } = this.props;

        modalSubmit[index].handleSubmit();
        if (modalSubmit[index].toggleModal) this.toggleModal();
    };

    render() {
        const {
            title,
            modalSubmit,
            cancelText,
            children,
            activeModal,
            handleGoBack,
        } = this.props;
        const { fadeOut } = this.state;

        if (activeModal) {
            return createPortal(
                <ModalView
                    content={children}
                    title={title}
                    modalSubmit={modalSubmit}
                    cancelText={cancelText}
                    fadeOut={fadeOut}
                    handleModalCancel={this.handleCancel}
                    handleSubmit={this.handleSubmit}
                    handleGoBack={handleGoBack}
                />,
                modalRoot,
            );
        }

        return null;
    }
}

export default Modal;
