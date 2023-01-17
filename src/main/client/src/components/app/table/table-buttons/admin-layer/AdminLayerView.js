// @flow
import React, { Fragment } from 'react';
import Table from '../../../../ui/blocks/Table';
import strings from '../../../../../translations';

type Props = {
    isOpen: boolean,
    setActiveModal: (modal: string) => void,
    activeDelete: boolean,
    editedLayers: Array<Object>,
    selectedAdminData: boolean,
    showConfirmModal: (
        body: string,
        acceptText: string,
        cancelText: string,
        accept: Function
    ) => void,
    saveEditedFeatures: Function,
    featureType: string,
    addressField: string,
    view: Object,
    hasTableEdited: boolean,
};

/** Table actions that are only visible for currently active admin table */
function AdminLayerView({
    isOpen,
    setActiveModal,
    activeDelete,
    editedLayers,
    selectedAdminData,
    showConfirmModal,
    saveEditedFeatures,
    featureType,
    addressField,
    view,
    hasTableEdited,
}: Props) {
    return (
        <>
            <Table.Button
                title={strings.reactTable.saveEditedData}
                tableOpen={isOpen}
                disabled={!hasTableEdited}
                onClick={
                    hasTableEdited
                        ? () => {
                            showConfirmModal(
                                strings.modalSaveEditedData.content,
                                strings.modalSaveEditedData.submit,
                                strings.modalSaveEditedData.cancel,
                                () => {
                                    saveEditedFeatures(
                                        view,
                                        editedLayers,
                                        featureType,
                                        addressField,
                                    );
                                },
                            );
                        } : null
                }
                admin
            >
                <i className="fas fa-save" />
            </Table.Button>
            <Table.Button
                title={strings.reactTable.deleteSelected}
                tableOpen={isOpen}
                disabled={!activeDelete || !selectedAdminData}
                onClick={
                    activeDelete && selectedAdminData ? () => {
                        setActiveModal('deleteSelected');
                    } : null
                }
                admin
            >
                <i className="fas fa-eraser" />
            </Table.Button>
        </>
    );
}

export default AdminLayerView;
