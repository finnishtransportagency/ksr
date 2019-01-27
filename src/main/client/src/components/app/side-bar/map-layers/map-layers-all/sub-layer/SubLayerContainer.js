// @flow
import { connect } from 'react-redux';
import SubLayerView from './SubLayerView';

const mapStateToProps = (state, ownProps) => ({
    layer: ownProps.layer,
    subLayers: ownProps.subLayers,
    layerList: state.map.layerGroups.layerList,
    loadingLayers: state.loading.loadingLayers,
});

const SubLayerContainer = connect(
    mapStateToProps,
    null,
)(SubLayerView);

export default SubLayerContainer;
