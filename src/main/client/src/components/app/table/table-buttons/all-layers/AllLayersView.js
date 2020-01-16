// @flow
import React, { Fragment } from 'react';
import Table from '../../../../ui/blocks/Table';
import strings from '../../../../../translations';
import { zoomToFeatures } from '../../../../../utils/map';

type Props = {
    isOpen: boolean,
    setActiveModal: (modal: string) => void,
    originalLayers: Array<Object>,
    showConfirmModal: (
        body: string,
        acceptText: string,
        cancelText: string,
        accept: Function
    ) => void,
    clearTableData: Function,
    view: Object,
};

/** Table actions that can target all open tables */
const AllLayersView = ({
    isOpen,
    setActiveModal,
    originalLayers,
    showConfirmModal,
    clearTableData,
    view,
}: Props) => (
    <Fragment>
        <Table.Button
            title={strings.reactTable.clearTableData}
            tableOpen={isOpen}
            disabled={!originalLayers.length}
            onClick={
                originalLayers.length ? () => {
                    showConfirmModal(
                        strings.modalClearTable.content,
                        strings.modalClearTable.submit,
                        strings.modalClearTable.cancel,
                        () => {
                            clearTableData();
                            view.popup.close();
                        },
                    );
                } : null}
        >
            <i className="fas fa-trash" />
        </Table.Button>
        <Table.Button
            title={strings.reactTable.bufferSelectedData}
            tableOpen={isOpen}
            disabled={!geometryDataSelected}
            onClick={
                geometryDataSelected ? () => {
                    setActiveModal('bufferSelectedData');
                } : null}
        >
            <i className="far fa-dot-circle" />
        </Table.Button>
        <Table.Button
            title={strings.reactTable.zoomToSelected}
            tableOpen={isOpen}
            disabled={!geometryDataSelected}
            onClick={
                geometryDataSelected ? async () => {
                    await zoomToFeatures(view, geometryData);
                } : null}
        >
            <i className="fas fa-search-plus" />
        </Table.Button>
    </Fragment>
);

export default AllLayersView;
