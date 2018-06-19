// @flow
import { connect } from 'react-redux';
import ReactTable from './ReactTable';
import { getFeatureData } from '../../../../reducers/table/actions';

const mapStateToProps = state => ({
    fetching: state.table.features.fetching,
    data: Array.from(state.table.features.data.values()),
    columns: Array.from(state.table.features.columns.values()),
});

const mapDispatchToProps = dispatch => ({
    getFeatureData: () => {
        dispatch(getFeatureData());
    },
});

const ReactTableContainer = connect(mapStateToProps, mapDispatchToProps)(ReactTable);

export default ReactTableContainer;
