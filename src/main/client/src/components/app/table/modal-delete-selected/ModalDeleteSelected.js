// @flow
import React from 'react';
import strings from '../../../../translations';
import ModalContainer from '../../shared/Modal/ModalContainer';

type Props = {
    selectedData: Array<Object>,
    deleteSelectedData: (selectedData: Array<Object>) => void,
};

const ModalDeleteSelected = ({ selectedData, deleteSelectedData }: Props) => (
    <ModalContainer
        title={strings.modalDeleteSelected.title}
        handleModalSubmit={() => { deleteSelectedData(selectedData); }}
        submitText={strings.modalDeleteSelected.submit}
        cancelText={strings.modalDeleteSelected.cancel}
    >
        {strings.modalDeleteSelected.content}
        <p>{ selectedData && selectedData.map(l => `${l._id} `)}</p>
    </ModalContainer>
);

export default ModalDeleteSelected;
