// @flow
import React, { Fragment } from 'react';
import equals from 'nano-equal';
import Table from '../../../../ui/blocks/Table';
import strings from '../../../../../translations';

type Props = {
    isOpen: boolean,
    setActiveModal: (modal: string) => void,
    activeUpdate: boolean,
    activeDelete: boolean,
    originalLayers: Array<Object>,
    editedLayers: Array<Object>,
    editedLayersNoUnderscore: Array<Object>,
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
};

/** Table actions that are only visible for currently active admin table */
const AdminLayerView = ({
    isOpen,
    setActiveModal,
    activeUpdate,
    activeDelete,
    originalLayers,
    editedLayers,
    selectedAdminData,
    showConfirmModal,
    saveEditedFeatures,
    featureType,
    addressField,
    view,
    editedLayersNoUnderscore,
}: Props) => (
    <Fragment>
        <Table.Button
            title={strings.reactTable.saveEditedData}
            tableOpen={isOpen}
            disabled={
                !activeUpdate
                || originalLayers.every(o => o._source === 'shapefile')
                || !originalLayers.length
                || equals(originalLayers, editedLayersNoUnderscore)
            }
            onClick={
                activeUpdate
                && originalLayers.length
                && !equals(originalLayers, editedLayersNoUnderscore)
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
    </Fragment>
);

export default AdminLayerView;
