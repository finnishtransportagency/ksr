// @flow
import React, { Fragment } from 'react';
import Table from '../../../../ui/blocks/Table';
import strings from '../../../../../translations';

type Props = {
    isOpen: boolean,
    setActiveModal: (modal: string) => void,
    originalLayers: Array<Object>,
    clearTableData: Function,
    view: Object,
    bufferExists: boolean,
    handleClearBuffer: Function,
    editedLayers: Array<Object>,
    featureType: string,
    addressField: string,
    layerList: Object[],
    activeAdminTool: string,
};

/** Table actions that can target all open tables */
function AllLayersView({
    isOpen,
    setActiveModal,
    originalLayers,
    clearTableData,
    view,
    bufferExists,
    handleClearBuffer,
    editedLayers,
    featureType,
    addressField,
    layerList,
    activeAdminTool,
}: Props): React$Element<React$FragmentType> {
    return (
        <>
            <Table.Button
                title={strings.reactTable.clearTableData}
                tableOpen={isOpen}
                disabled={!originalLayers.length}
                onClick={
                    originalLayers.length ? () => {
                        clearTableData(
                            view,
                            editedLayers,
                            featureType,
                            addressField,
                            layerList,
                            activeAdminTool
                        && layerList.find(l => l.id === activeAdminTool && l.type === 'agfl') !== undefined,
                        );
                    } : null
                }
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
                        : null
                }
            >
                <i className="fas fa-search-plus" />
            </Table.Button>
        </>
    );
}

export default AllLayersView;
