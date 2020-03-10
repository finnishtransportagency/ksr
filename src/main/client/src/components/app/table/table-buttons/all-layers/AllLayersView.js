// @flow
import React, { Fragment } from 'react';
import Table from '../../../../ui/blocks/Table';
import strings from '../../../../../translations';

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
    bufferExists: boolean,
    handleClearBuffer: Function,
};

/** Table actions that can target all open tables */
const AllLayersView = ({
    isOpen,
    setActiveModal,
    originalLayers,
    showConfirmModal,
    clearTableData,
    view,
    bufferExists,
    handleClearBuffer,
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
            disabled={!originalLayers.length}
            active={bufferExists}
            onClick={
                bufferExists
                    ? () => { if (originalLayers.length) handleClearBuffer(); }
                    : () => { if (originalLayers.length) setActiveModal('bufferSelectedData'); }
            }
        >
            <i className="far fa-dot-circle" />
        </Table.Button>
        <Table.Button
            title={strings.reactTable.zoomToSelected}
            tableOpen={isOpen}
            disabled={!originalLayers.length}
            onClick={
                originalLayers.length
                    ? async () => { setActiveModal('zoomToFeatures'); }
                    : null}
        >
            <i className="fas fa-search-plus" />
        </Table.Button>
    </Fragment>
);

export default AllLayersView;
