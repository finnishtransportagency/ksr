// @flow
import { connect } from 'react-redux';
import { getWorkspaceList } from '../../../../reducers/workspace/actions';
import ModalNewWorkspace from './ModalNewWorkspace';

const mapStateToProps = state => ({
    selectedFeatures: state.table.features.layers,
    view: state.map.mapView.view,
    layerList: state.map.layerGroups.layerList,
});

const mapDispatchToProps = dispatch => ({
    getWorkspaceList: () => {
        dispatch(getWorkspaceList());
    },
});

const ModalNewWorkspaceContainer = connect(mapStateToProps, mapDispatchToProps)(ModalNewWorkspace);

export default ModalNewWorkspaceContainer;
