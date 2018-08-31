// @flow
import { connect } from 'react-redux';
import ModalNewWorkspace from './ModalNewWorkspace';

const mapStateToProps = state => ({
    selectedFeatures: state.table.features.layers,
    view: state.map.mapView.view,
    layerList: state.map.layerGroups.layerList,
});

const ModalNewWorkspaceContainer = connect(mapStateToProps, null)(ModalNewWorkspace);

export default ModalNewWorkspaceContainer;
