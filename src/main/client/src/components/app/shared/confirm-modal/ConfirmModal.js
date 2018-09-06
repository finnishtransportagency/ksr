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
};

class ConfirmModal extends Component<Props> {
    constructor(props: any) {
        super(props);

        this.handleAccept = this.handleAccept.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    handleAccept = () => {
        const { accept } = this.props;

        accept();
        this.handleCancel();
    };

    handleCancel = () => {
        const { hideConfirmModal } = this.props;
        hideConfirmModal();
    };

    render() {
        const {
            show,
            body,
            acceptText,
            cancelText,
        } = this.props;

        if (show) {
            return createPortal(
                <ConfirmModalView
                    body={body}
                    acceptText={acceptText}
                    cancelText={cancelText}
                    handleAccept={this.handleAccept}
                    handleCancel={this.handleCancel}
                />,
                modalRoot,
            );
        }

        return null;
    }
}

export default ConfirmModal;
