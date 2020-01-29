// @flow
import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import Draggable from 'react-draggable';
import Modal from '../../../ui/blocks/Modal/index';
import { Button, H1 } from '../../../ui/elements/index';
import { Wrapper } from '../styles';

type ModalSubmit = {
    text: string,
    handleSubmit: Function,
    disabled: boolean,
    toggleModal: boolean,
};

type Props = {
    handleModalCancel: Function,
    modalSubmit: ModalSubmit[],
    content: any,
    title: string,
    cancelText: string,
    fadeOut: boolean,
    handleSubmit: (index: number) => void,
    handleGoBack: Function,
};

const ModalView = ({
    handleModalCancel,
    modalSubmit,
    content,
    title,
    cancelText,
    fadeOut,
    handleSubmit,
    handleGoBack,
}: Props) => (
    <Modal.Blur>
        <Draggable bounds="parent" handle=".handler">
            <Modal fadeOut={fadeOut}>
                <Wrapper className="handler">
                    <Modal.Header>
                        <H1 secondary>{title}</H1>
                        <button type="button" onClick={handleModalCancel}>
                            <i className="fas fa-times" />
                        </button>
                    </Modal.Header>
                </Wrapper>
                <Scrollbars autoHeight autoHeightMax={500} className="modal-content-scroll-wrapper">
                    <Modal.Content>
                        {content}
                    </Modal.Content>
                </Scrollbars>
                {modalSubmit.length || cancelText
                    ? (
                        <Modal.Footer>
                            {modalSubmit.map((submit, i) => (
                                <Button
                                    key={submit.text}
                                    disabled={submit.disabled}
                                    onClick={() => handleSubmit(i)}
                                >
                                    {submit.text}
                                </Button>
                            ))}
                            <Button flat onClick={handleGoBack || handleModalCancel}>
                                {cancelText}
                            </Button>
                        </Modal.Footer>
                    )
                    : null
                }
            </Modal>
        </Draggable>
    </Modal.Blur>
);

export default ModalView;
