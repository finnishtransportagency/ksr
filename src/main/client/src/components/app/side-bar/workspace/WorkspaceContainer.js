// @flow
import { connect } from 'react-redux';
import { showConfirmModal } from '../../../../reducers/confirmModal/actions';
import { getWorkspaceList } from '../../../../reducers/workspace/actions';
import { setActiveModal } from '../../../../reducers/modal/actions';
import Workspace from './Workspace';

const mapStateToProps = state => ({
    workspaceList: state.workspace.workspace.workspaceList,
    selectedFeatures: state.table.features.layers,
    view: state.map.mapView.view,
    layerList: state.map.layerGroups.layerList,
});

const mapDispatchToProps = dispatch => ({
    setActiveModal: (activeModal: string) => {
        dispatch(setActiveModal(activeModal));
    },
    getWorkspaceList: () => {
        dispatch(getWorkspaceList());
    },
    showConfirmModal: (body: string, acceptText: string, cancelText: string, accept: Function) => {
        dispatch(showConfirmModal(body, acceptText, cancelText, accept));
    },
});

const WorkspaceContainer = connect(mapStateToProps, mapDispatchToProps)(Workspace);

export default WorkspaceContainer;
