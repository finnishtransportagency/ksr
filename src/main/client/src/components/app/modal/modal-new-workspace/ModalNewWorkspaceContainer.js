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
    updateWorkspaces: (workspaceFetch: Function, fetchParam: Object | string, type: string) => {
        dispatch(updateWorkspaces(workspaceFetch, fetchParam, type));
    },
});

const ModalNewWorkspaceContainer = (connect(
    mapStateToProps,
    mapDispatchToProps,
)(ModalNewWorkspace): any);

export default ModalNewWorkspaceContainer;
