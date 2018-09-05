// @flow
import { connect } from 'react-redux';
import { getLayerGroups, getMapConfig } from '../../../reducers/map/actions';
import { getWorkspaceList } from '../../../reducers/workspace/actions';
import Home from './Home';

const mapDispatchToProps = dispatch => ({
    getLayerGroups: () => {
        dispatch(getLayerGroups());
    },
    getMapConfig: () => {
        dispatch(getMapConfig());
    },
    getWorkspaceList: () => {
        dispatch(getWorkspaceList());
    },
});

const HomeContainer = connect(null, mapDispatchToProps)(Home);

export default HomeContainer;
