// @flow
import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import Modal from '../../../ui/blocks/Modal/index';
import { Button, H1 } from '../../../ui/elements/index';

type Props = {
    toggleModal: Function,
    handleModalSubmit: Function,
    content: any,
    title: string,
    submitText: string,
    cancelText: string,
};

const ModalView = ({
    toggleModal,
    handleModalSubmit,
    content,
    title,
    submitText,
    cancelText,
}: Props) => (
    <Modal>
        <Modal.Blur />
        <Modal.Header>
            <H1 secondary>{title}</H1>
            <button onClick={toggleModal}>
                <i className="fas fa-times" />
            </button>
        </Modal.Header>
        <Scrollbars autoHeight>
            <Modal.Content>
                {content}
            </Modal.Content>
        </Scrollbars>
        <Modal.Footer>
            <Button onClick={handleModalSubmit}>
                {submitText}
            </Button>
            <Button flat onClick={toggleModal}>
                {cancelText}
            </Button>
        </Modal.Footer>
    </Modal>
);

export default ModalView;