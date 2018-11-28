// @flow
import { connect } from 'react-redux';
import { setUserInfo } from '../../../reducers/user/actions';
import { setWorkspace, updateWorkspaces } from '../../../reducers/workspace/actions';
import { getLayerGroups, getMapConfig } from '../../../reducers/map/actions';
import { loadFailedEdits } from '../../../reducers/offline/actions';
import Home from './Home';

const mapStateToProps = state => ({
    loadingWorkspace: state.workspace.workspace.loadingWorkspace,
});

const mapDispatchToProps = dispatch => ({
    updateWorkspaces: (workspaceFetch: Function, fetchParam: Object | string) => (
        dispatch(updateWorkspaces(workspaceFetch, fetchParam))
    ),
    getLayerGroups: () => (
        dispatch(getLayerGroups())
    ),
    getMapConfig: () => (
        dispatch(getMapConfig())
    ),
    setWorkspace: () => (
        dispatch(setWorkspace())
    ),
    setUserInfo: () => (
        dispatch(setUserInfo())
    ),
    loadFailedEdits: () => (
        dispatch(loadFailedEdits())
    ),
});

const HomeContainer = connect(mapStateToProps, mapDispatchToProps)(Home);

export default HomeContainer;
