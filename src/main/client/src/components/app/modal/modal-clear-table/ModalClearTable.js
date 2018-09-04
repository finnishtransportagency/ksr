// @flow
import React from 'react';
import strings from '../../../../translations';
import ModalContainer from '../../shared/Modal/ModalContainer';

type Props = {
    clearTableData: Function,
};

const ModalClearTable = ({ clearTableData }: Props) => (
    <ModalContainer
        title={strings.modalClearTable.title}
        handleModalSubmit={() => clearTableData()}
        submitText={strings.modalClearTable.submit}
        cancelText={strings.modalClearTable.cancel}
    >
        {strings.modalClearTable.content}
    </ModalContainer>
);

export default ModalClearTable;
