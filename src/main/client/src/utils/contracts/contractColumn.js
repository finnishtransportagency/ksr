// @flow
import React from 'react';
import strings from '../../translations';

/**
 * Adds clickable contract icon to table if layer has contract relations.
 *
 * @param {Function} setActiveModal Redux action to set active modal.
 * @param {Object[]} columns Currently active layers table columns.
 *
 * @returns {Object[]} Modified columns with contract icon added as first column.
 */
export const addContractColumn = (setActiveModal: Function, columns: Object[]) => ([
    {
        columns: [{
            width: 30,
            maxWidth: 30,
            sortable: false,
            filterable: false,
            resizeable: false,
            Cell: () => (
                <div
                    title={strings.modalFeatureContracts.featureContracts}
                    role="button"
                    tabIndex={0}
                    onClick={() => setActiveModal('featureContracts')}
                    onKeyPress={() => setActiveModal('featureContracts')}
                    className="contract-icon"
                >
                    <i className="fas fa-tasks" />
                </div>
            ),
            style: {
                padding: '0',
                textAlign: 'center',
                userSelect: 'none',
                background: '#4B4B4B',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            },
        }],
    },
    ...columns,
]);

