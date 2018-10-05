// @flow
import { connect } from 'react-redux';
import TabbedTableView from './TabbedTableView';

import { setActiveTable } from './../../../../reducers/table/actions';

const mapStateToProps = state => ({
    layers: state.table.features.layers.map(l => ({
        id: l.id,
        title: l.title,
        _source: l._source,
        type: l.type,
    })),
    activeTable: state.table.features.activeTable,
});

const mapDispatchToProps = dispatch => ({
    setActiveTable: (activeTable) => {
        dispatch(setActiveTable(activeTable));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(TabbedTableView);
