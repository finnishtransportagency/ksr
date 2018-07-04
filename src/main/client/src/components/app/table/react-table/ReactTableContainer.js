// @flow
import { connect } from 'react-redux';
import ReactTable from './ReactTable';

const mapStateToProps = state => ({
    activeTable: state.table.features.activeTable,
    fetching: state.table.features.fetching,
    layer: (
        state.table.features.activeTable && state.table.features.layers.length ?
            state.table.features.layers.find(l => l.id === state.table.features.activeTable) : null
    ),
});

const mapDispatchToProps = dispatch => ({
});

const ReactTableContainer = connect(mapStateToProps, mapDispatchToProps)(ReactTable);

export default ReactTableContainer;
