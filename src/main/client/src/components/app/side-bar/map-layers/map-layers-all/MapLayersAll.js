// @flow
import React, { Component } from 'react';
import LoadingIcon from '../../../shared/LoadingIcon';
import MapLayersAllView from './MapLayersAllView';

type Props = {
    layerGroups: {
        layerGroups: Array<any>,
        fetching: boolean,
    },
};

type State = {
    activeGroup: number,
};

const initialState = {
    activeGroup: 0,
};

class MapLayersActive extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = { ...initialState };

        this.handleGroupClick = this.handleGroupClick.bind(this);
    }

    handleGroupClick = (id: number) => {
        const { activeGroup } = this.state;

        if (activeGroup === id) {
            this.setState({ activeGroup: 0 });
        } else {
            this.setState({ activeGroup: id });
        }
    };

    render() {
        const { activeGroup } = this.state;
        const { layerGroups } = this.props;

        if (!layerGroups.fetching) {
            return (
                <MapLayersAllView
                    layerGroups={layerGroups.layerGroups}
                    handleGroupClick={this.handleGroupClick}
                    activeGroup={activeGroup}
                />
            );
        }

        return <LoadingIcon loading={layerGroups.fetching} />;
    }
}

export default MapLayersActive;
