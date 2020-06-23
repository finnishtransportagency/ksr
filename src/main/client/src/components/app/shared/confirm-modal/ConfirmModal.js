// @flow
import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import ConfirmModalView from './ConfirmModalView';

const modalRoot: any = document.getElementById('modal-root');

type Props = {
    show: boolean,
    body: string,
    acceptText: string,
    cancelText: string,
    accept: Function,
    hideConfirmModal: Function,
    cancel?: Function,
};

type State = {
    fadeOut: boolean,
};

const initialState = {
    fadeOut: false,
};

class ConfirmModal extends Component<Props, State> {
    static defaultProps = { cancel: () => {} };

    constructor(props: any) {
        super(props);

        this.state = { ...initialState };

        this.handleAccept = this.handleAccept.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    handleAccept = () => {
        const { accept } = this.props;

        accept();
        this.handleCancel();
    };

    handleCancel = () => {
        const { cancel } = this.props;

        if (cancel) {
            cancel();
        }
        this.hideModal();
    };

    hideModal = () => {
        const { hideConfirmModal } = this.props;

        this.setState({ fadeOut: true });
        setTimeout(() => {
            hideConfirmModal();
        }, 300);
    };

    render() {
        const {
            show,
            body,
            acceptText,
            cancelText,
        } = this.props;
        const { fadeOut } = this.state;

        if (show) {
            return createPortal(
                <ConfirmModalView
                    body={body}
                    acceptText={acceptText}
                    cancelText={cancelText}
                    handleAccept={this.handleAccept}
                    handleCancel={this.handleCancel}
                    fadeOut={fadeOut}
                />,
                modalRoot,
            );
        }

        return null;
    }
}

export default ConfirmModal;
