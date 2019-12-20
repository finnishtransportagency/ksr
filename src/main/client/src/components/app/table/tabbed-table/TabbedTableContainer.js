// @flow
import { connect } from 'react-redux';
import TabbedTableView from './TabbedTableView';

import { setActiveTable } from './../../../../reducers/table/actions';
import { deactivateLayer } from '../../../../reducers/map/actions';
import { showConfirmModal } from '../../../../reducers/confirmModal/actions';

const mapStateToProps = state => ({
    layers: state.table.features.layers.map(l => ({
        id: l.id,
        title: l.title,
        _source: l._source,
        type: l.type,
    })),
    activeTable: state.table.features.activeTable,
    activeAdmin: state.adminTool.active.layerId,
});

const mapDispatchToProps = dispatch => ({
    setActiveTable: (activeTable) => {
        dispatch(setActiveTable(activeTable));
    },
    showConfirmModal: (body: string, acceptText: string, cancelText: string, accept: Function) => {
        dispatch(showConfirmModal(body, acceptText, cancelText, accept));
    },
    deactivateLayer: (layerId) => {
        dispatch(deactivateLayer(layerId));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(TabbedTableView);
