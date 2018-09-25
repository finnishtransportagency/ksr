// @flow
import { connect } from 'react-redux';
import { updateWorkspaces } from '../../../../reducers/workspace/actions';
import ModalNewWorkspace from './ModalNewWorkspace';

const mapStateToProps = state => ({
    selectedFeatures: state.table.features.layers,
    view: state.map.mapView.view,
    layerList: state.map.layerGroups.layerList,
});

const mapDispatchToProps = dispatch => ({
    updateWorkspaces: (workspaceFetch: Function, fetchParam: Object | string) => {
        dispatch(updateWorkspaces(workspaceFetch, fetchParam));
    },
});

const ModalNewWorkspaceContainer = connect(mapStateToProps, mapDispatchToProps)(ModalNewWorkspace);

export default ModalNewWorkspaceContainer;
