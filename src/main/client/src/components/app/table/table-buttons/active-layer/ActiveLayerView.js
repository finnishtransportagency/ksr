// @flow
import React, { Fragment } from 'react';
import Table from '../../../../ui/blocks/Table';
import strings from '../../../../../translations';

type Props = {
    isOpen: boolean,
    setActiveModal: (modal: string) => void,
    originalLayers: Array<Object>,
    geometryDataSelected: boolean,
    activeTableDataSelected: boolean,
    activeTableLayer: Object,
};

/** Table actions that only target currently active table */
function ActiveLayerView({
    isOpen,
    setActiveModal,
    originalLayers,
    geometryDataSelected,
    activeTableDataSelected,
    activeTableLayer,
}: Props): React$Element<React$FragmentType> {
    return (
        <>
            <Table.Button
                title={strings.reactTable.filter}
                tableOpen={isOpen}
                disabled={!originalLayers.length}
                onClick={
                    originalLayers.length ? () => {
                        setActiveModal('filter');
                    } : null
                }
                activeLayer
            >
                <i className="fas fa-filter" />
            </Table.Button>
            <Table.Button
                title={strings.reactTable.extractSelectedData}
                tableOpen={isOpen}
                disabled={
                    !activeTableLayer
                || activeTableLayer._source === 'shapefile'
                || !geometryDataSelected
                || !activeTableDataSelected
                }
                onClick={
                    activeTableLayer
                && activeTableLayer._source !== 'shapefile'
                && geometryDataSelected
                && activeTableDataSelected
                        ? () => {
                            setActiveModal('extractSelectedData');
                        } : null
                }
                activeLayer
            >
                <i className="fas fa-file-export" />
            </Table.Button>
            <Table.Button
                title={strings.reactTable.downloadCsv}
                tableOpen={isOpen}
                disabled={!originalLayers.length}
                onClick={
                    originalLayers.length ? () => {
                        setActiveModal('downloadCSV');
                    } : null
                }
                activeLayer
            >
                <i className="fas fa-file-csv" />
            </Table.Button>
        </>
    );
}

export default ActiveLayerView;
