// @flow
import React from 'react';
import strings from '../../translations';
import * as styles from '../../components/ui/defaultStyles';

/**
 * Adds clickable layer details icon to table if layer has contract relations.
 *
 * @param {Function} handleContractClick Opens contract modal and saves objectId to redux.
 * @param {Object[]} columns Currently active layer's table columns.
 * @param {boolean} contract Whether the current layer is main contract layer.
 *
 * @returns {Object[]} Modified columns with layer details icon added as first column.
 */
export const addContractColumn = (
    handleContractClick: Function,
    columns: Object[],
    contract: boolean,
) => ([
    {
        Header: '',
        columns: [{
            width: 30,
            maxWidth: 30,
            sortable: false,
            filterable: false,
            resizable: false,
            Cell: (row: Object) => (
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
            ),
            style: {
                textAlign: 'center',
                userSelect: 'none',
                background: styles.colorBackgroundDarkSecondary,
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            },
        }],
        fixed: 'left',
    },
    ...columns,
]);
