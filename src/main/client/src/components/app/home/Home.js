// @flow
import React, { Component } from 'react';
import { fetchGetWorkspaceList } from '../../../api/workspace/getWorkspaceList';
import HomeView from './HomeView';

type Props = {
    getLayerGroups: Function,
    getMapConfig: Function,
    setWorkspace: Function,
    updateWorkspaces: Function,
    setUserInfo: Function,
    loadFailedEdits: Function,
    loading: boolean,
};

class Home extends Component<Props, null> {
    componentDidMount() {
        const {
            getLayerGroups,
            getMapConfig,
            updateWorkspaces,
            setWorkspace,
            setUserInfo,
            loadFailedEdits,
        } = this.props;

        setUserInfo();
        setWorkspace();
        getLayerGroups();
        getMapConfig();
        updateWorkspaces(fetchGetWorkspaceList);
        loadFailedEdits();
    }

    render() {
        const { loading } = this.props;
        return <HomeView loading={loading} />;
    }
}

export default Home;
