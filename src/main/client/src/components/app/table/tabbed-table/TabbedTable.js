// @flow
import React from 'react';
import TabbedTableView from './TabbedTableView';
import strings from '../../../../translations';
import save from '../../../../utils/saveFeatureData';

type Props = {
    layers: Array<Object>,
    activeTable: string,
    setActiveTable: Function,
    activeAdmin: string,
    showConfirmModal: (
        body: string,
        acceptText: string,
        cancelText: string,
        accept: Function,
        cancel: Function,
    ) => void,
    closeTableTab: Function,
    view: Object,
    editedLayers: Object[],
    featureType: string,
    addressField: string,
};

const TabbedTable = ({
    layers,
    activeTable,
    setActiveTable,
    activeAdmin,
    showConfirmModal,
    closeTableTab,
    view,
    editedLayers,
    featureType,
    addressField,
}: Props) => {
    const closeTab = (layerId) => {
        const editedLayer = editedLayers.find(e => e.id === layerId);
        const containsEdit = editedLayer && editedLayer.data
            .some(d => d._edited.length > 0);
        if (containsEdit) {
            showConfirmModal(
                strings.modalClearTable.content,
                strings.modalClearTable.submit,
                strings.modalClearTable.cancel,
                () => {
                    setTimeout(() => {
                        showConfirmModal(
                            strings.modalSaveEditedData.content,
                            strings.modalSaveEditedData.submit,
                            strings.modalSaveEditedData.cancel,
                            () => {
                                save.saveEditedFeatureData(
                                    view,
                                    editedLayers,
                                    featureType,
                                    addressField,
                                ).then(() => {
                                    closeTableTab(layerId);
                                    view.popup.close();
                                });
                            },
                            () => {
                                closeTableTab(layerId);
                                view.popup.close();
                            },
                        );
                    }, 500);
                },
            );
        } else {
            showConfirmModal(
                strings.modalClearTable.content,
                strings.modalClearTable.submit,
                strings.modalClearTable.cancel,
                () => {
                    closeTableTab(layerId);
                    view.popup.close();
                },
            );
        }
    };

    return (
        <TabbedTableView
            layers={layers}
            activeTable={activeTable}
            setActiveTable={setActiveTable}
            activeAdmin={activeAdmin}
            closeTab={closeTab}
        />
    );
};

export default TabbedTable;
