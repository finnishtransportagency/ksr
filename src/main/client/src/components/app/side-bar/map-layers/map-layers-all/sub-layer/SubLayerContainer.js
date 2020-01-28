// @flow
import { connect } from 'react-redux';
import SubLayerView from './SubLayerView';

const mapStateToProps = (state, ownProps) => ({
    layer: state.map.layerGroups.layerList.find(layer => layer.id === ownProps.layer.id),
    subLayers: state.map.layerGroups.layerList.filter(ll => ll.parentLayer),
    layerList: state.map.layerGroups.layerList,
    loadingLayers: state.loading.loadingLayers,
});

const SubLayerContainer = (connect(mapStateToProps)(SubLayerView): any);

export default SubLayerContainer;
