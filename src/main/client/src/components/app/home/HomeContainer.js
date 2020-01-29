// @flow
import { connect } from 'react-redux';
import { setUserInfo } from '../../../reducers/user/actions';
import { setWorkspace, updateWorkspaces } from '../../../reducers/workspace/actions';
import { getLayerGroups, getMapConfig } from '../../../reducers/map/actions';
import { loadFailedEdits } from '../../../reducers/offline/actions';
import { setLoading } from '../../../reducers/loading/actions';
import Home from './Home';

const mapStateToProps = state => ({
    loading: state.loading.loading,
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
    setLoading: () => (
        dispatch(setLoading())
    ),
});

const HomeContainer = (connect(mapStateToProps, mapDispatchToProps)(Home): any);

export default HomeContainer;
