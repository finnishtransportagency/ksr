// @flow
import React, { Fragment } from 'react';
import strings from '../../translations';
import * as styles from '../../components/ui/defaultStyles';

/**
 * Action columns for table row.
 *
 * Column which opens single row feature data into a modal.
 * If layer has contract relations; column which opens feature relation data.
 *
 * @param {Function} handleContractClick Opens contract modal and saves objectId to redux.
 * @param {Function} handleFeatureInfoClick Opens single row feature data into a modal.
 * @param {Object[]} columns Currently active layer's table columns.
 * @param {boolean} contract Whether the current layer is main contract layer.
 * @param {boolean} layerHasRelations Whether the current layer has contract relations.
 * @param {boolean} isAgfl Whether layer type is agfl.
 * @param {boolean} adminActive Whether current tab layer is in admin mode.
 *
 * @returns {Object[]} Modified columns with action buttons as first column.
 */
export const addActionColumn = (
    handleContractClick: Function,
    handleFeatureInfoClick: Function,
    columns: Object[],
    contract: boolean,
    layerHasRelations: boolean,
    isAgfl: boolean,
    adminActive: boolean,
    sketchToolActive: boolean,
    addNewGeometryToFeature: Function,
): any => {
    const actionColumn = {
        Header: '',
        columns: [{
            width: 70,
            maxWidth: 70,
            sortable: false,
            filterable: false,
            resizable: false,
            Cell: (row: Object) => (
                <>
                    { layerHasRelations && (
                        <div
                            title={contract
                                ? strings.modalContractDetails.listView.title
                                : strings.modalFeatureContracts.listView.title}
                            role="button"
                            tabIndex={0}
                            onClick={() => handleContractClick(row)}
                            onKeyPress={() => handleContractClick(row)}
                            className="contract-icon"
                        >
                            <i className="fas fa-external-link-square-alt" />
                        </div>
                    )}
                    <div
                        title={strings.modalSingleFeatureInfo.title}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleFeatureInfoClick(row)}
                        onKeyPress={() => handleFeatureInfoClick(row)}
                        className="contract-icon"
                    >
                        <i className="fas fa-list" />
                    </div>
                    { !isAgfl && !row.original.geometry && (
                        <div
                            title={strings.reactTable.addMissingGeometry}
                            role="button"
                            tabIndex={0}
                            className={`contract-icon${adminActive && !sketchToolActive ? '' : ' disabled'}`}
                            onClick={() => {
                                if (adminActive && !sketchToolActive) {
                                    addNewGeometryToFeature(row.original);
                                }
                            }}
                            onKeyPress={() => {
                                if (adminActive && !sketchToolActive) {
                                    addNewGeometryToFeature(row.original);
                                }
                            }}
                        >
                            <i className="esri-icon-polygon" />
                        </div>
                    )}
                </>
            ),
            style: {
                textAlign: 'center',
                userSelect: 'none',
                background: styles.colorBackgroundDarkSecondary,
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-evenly',
            },
        }],
        fixed: 'left',
    };

    return [
        actionColumn,
        ...columns,
    ];
};
