// @flow
import { connect } from 'react-redux';
import SketchTool from './SketchTool';

import { selectFeaturesFromArea } from './../../../../reducers/table/actions';

const mapStateToProps = state => ({
    data: Array.from(state.table.features.data.values()),
});

const mapDispatchToProps = dispatch => ({
    selectFeaturesFromArea: (features, option) => {
        dispatch(selectFeaturesFromArea(features, option));
    },
});

const SketchToolContainer = connect(mapStateToProps, mapDispatchToProps)(SketchTool);

export default SketchToolContainer;
