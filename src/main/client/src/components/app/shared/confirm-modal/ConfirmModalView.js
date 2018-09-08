// @flow
import React from 'react';
import Modal from '../../../ui/blocks/Modal/index';
import { Button } from '../../../ui/elements/index';

type Props = {
    handleAccept: Function,
    handleCancel: Function,
    body: string,
    acceptText: string,
    cancelText: string,
    fadeOut: boolean,
};

const ConfirmModalView = ({
    handleAccept,
    handleCancel,
    body,
    acceptText,
    cancelText,
    fadeOut,
}: Props) => (
    <Modal confirm fadeOut={fadeOut}>
        <Modal.Blur />
        <Modal.Content>
            <p>{body}</p>
        </Modal.Content>
        <Modal.Footer>
            <Button onClick={handleAccept}>
                {acceptText}
            </Button>
            <Button flat onClick={handleCancel}>
                {cancelText}
            </Button>
        </Modal.Footer>
    </Modal>
);

export default ConfirmModalView;
