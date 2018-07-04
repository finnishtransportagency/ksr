// @flow
import { connect } from 'react-redux';
import SketchTool from './SketchTool';

import { selectFeatures, deSelectSelected } from './../../../../reducers/table/actions';

const mapStateToProps = state => ({
    data: state.table.features.layers
        .reduce((a, b) => a.concat(b.data.filter(d => d._selected)), []),
});

const mapDispatchToProps = dispatch => ({
    selectFeatures: (features) => {
        dispatch(selectFeatures(features));
    },
    deSelectSelected: () => {
        dispatch(deSelectSelected());
    },
});

const SketchToolContainer = connect(mapStateToProps, mapDispatchToProps)(SketchTool);

export default SketchToolContainer;
