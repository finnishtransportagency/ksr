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
    setLoading: Function,
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
            setLoading,
        } = this.props;

        setLoading();
        setUserInfo();
        setWorkspace();
        getLayerGroups();
        getMapConfig();
        updateWorkspaces(fetchGetWorkspaceList);
        loadFailedEdits();
    }

    render(): React$Element<(_0: Props) => any> {
        const { loading } = this.props;
        return <HomeView loading={loading} />;
    }
}

export default Home;
