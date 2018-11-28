// @flow
import React, { Component } from 'react';
import { fetchGetWorkspaceList } from '../../../api/workspace/getWorkspaceList';
import HomeView from './HomeView';

type Props = {
    getLayerGroups: Function,
    getMapConfig: Function,
    setWorkspace: Function,
    updateWorkspaces: Function,
    loadingWorkspace: boolean,
    setUserInfo: Function,
    loadFailedEdits: Function,
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
        const { loadingWorkspace } = this.props;
        return <HomeView loadingWorkspace={loadingWorkspace} />;
    }
}

export default Home;
