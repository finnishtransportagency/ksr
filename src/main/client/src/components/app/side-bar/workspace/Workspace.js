// @flow
import React, { Component } from 'react';
import WorkspaceView from './WorkspaceView';

type Props = {
    setActiveModal: (activeModal: string) => void,
};

type State = {
    /* ... */
}

const initialState = {
    /* ... */
};

class Workspace extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = { ...initialState };
    }

    render() {
        const { setActiveModal } = this.props;

        return (
            <WorkspaceView
                setActiveModal={setActiveModal}
            />
        );
    }
}

export default Workspace;
