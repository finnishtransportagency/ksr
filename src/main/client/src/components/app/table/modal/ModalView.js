// @flow
import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import Modal from '../../../ui/blocks/Modal/index';
import Checkbox from '../../../ui/blocks/Checkbox/index';
import { Button, H1 } from '../../../ui/elements/index';
import strings from '../../../../translations';
import { ModalFilter } from './styles';

type Props = {
    columns: Array<any>,
    modalOpen: boolean,
    toggleModal: Event => void,
    handleOnChange: Event => void,
    handleModalSubmit: Event => void,
};

const ModalView = ({
    columns,
    modalOpen,
    toggleModal,
    handleOnChange,
    handleModalSubmit,
}: Props) => (
    <ModalFilter modalOpen={modalOpen}>
        <Modal.Blur />
        <Modal.Header>
            <H1 secondary>{strings.modalView.title}</H1>
            <button onClick={toggleModal}>
                <i className="fas fa-times" />
            </button>
        </Modal.Header>
        <Scrollbars
            autoHide
            autoHeight
            autoHeightMax={400}
        >
            <Modal.Content className="content-filter">
                {
                    columns.map(t => (
                        <Checkbox className="content-checkbox" key={t.Header} htmlFor={t.Header}>
                            {t.Header}
                            <Checkbox.Input
                                id={t.Header}
                                name={t.Header}
                                type="checkbox"
                                checked={t.show}
                                onChange={() => {
                                    handleOnChange(t.Header);
                                }}
                            />
                            <Checkbox.Checkmark />
                        </Checkbox>
                    ))
                }
            </Modal.Content>
        </Scrollbars>
        <Modal.Footer>
            <Button onClick={handleModalSubmit}>{strings.modalView.submit}</Button>
            <Button flat onClick={toggleModal}>
                {strings.modalView.cancel}
            </Button>
        </Modal.Footer>
    </ModalFilter>
);

export default ModalView;
