// @flow
import { connect } from 'react-redux';
import ReactTable from './ReactTable';
import { getFeatureData } from '../../../../reducers/table/actions';

const mapStateToProps = state => ({
    fetching: state.table.features.fetching,
    data: state.table.features.data,
    columns: state.table.features.columns,
});

const mapDispatchToProps = dispatch => ({
    getFeatureData: () => {
        dispatch(getFeatureData());
    },
});

const ReactTableContainer = connect(mapStateToProps, mapDispatchToProps)(ReactTable);

export default ReactTableContainer;
