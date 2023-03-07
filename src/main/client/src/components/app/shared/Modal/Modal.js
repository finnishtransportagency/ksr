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
    modalScrollSize: number;
};

const initialState = {
    fadeOut: false,
    modalScrollSize: window.innerHeight - 220,
};

class Modal extends Component<Props, State> {
    static defaultProps: any = {
        handleModalCancel: undefined,
        handleGoBack: undefined,
    };

    constructor(props: any) {
        super(props);

        this.state = { ...initialState };

        this.toggleModal = this.toggleModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.setModalScrollSize = this.setModalScrollSize.bind(this);
    }

    toggleModal: any = () => {
        const { activeModal, setActiveModal } = this.props;

        this.setState({ fadeOut: true });
        setTimeout(() => {
            if (activeModal) setActiveModal('');
        }, 300);
    };

    handleCancel: any = () => {
        const { handleModalCancel } = this.props;
        if (handleModalCancel) handleModalCancel();
        this.toggleModal();
    };

    handleSubmit: any = (index: number) => {
        const { modalSubmit } = this.props;

        modalSubmit[index].handleSubmit();
        if (modalSubmit[index].toggleModal) this.toggleModal();
    };

    setModalScrollSize: any = () => {
        this.setState(
            {
                modalScrollSize: window.innerHeight - 220,
            },
        );
    };

    componentDidMount() {
        this.setModalScrollSize();

        window.addEventListener('resize', this.setModalScrollSize);
    }

    render(): any {
        const {
            title,
            modalSubmit,
            cancelText,
            children,
            activeModal,
            handleGoBack,
        } = this.props;
        const { fadeOut, modalScrollSize } = this.state;

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
                    modalScrollSize={modalScrollSize}
                />,
                modalRoot,
            );
        }

        return null;
    }
}

export default Modal;
