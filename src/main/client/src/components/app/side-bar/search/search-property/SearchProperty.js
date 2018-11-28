// @flow
import React, { Component } from 'react';
import SearchPropertyView from './SearchPropertyView';

type Props = {
    features: Object[],
    fetching: boolean,
}

type State = {
    activeProperty: string,
};

const initialState = {
    activeProperty: '',
};

class SearchProperty extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = { ...initialState };

        this.handlePropertyClick = this.handlePropertyClick.bind(this);
    }

    handlePropertyClick = (id: string) => {
        const { activeProperty } = this.state;

        if (activeProperty === id) {
            this.setState({ activeProperty: initialState.activeProperty });
        } else {
            this.setState({ activeProperty: id });
        }
    };

    render() {
        const { activeProperty } = this.state;
        const { features, fetching } = this.props;

        return (
            <SearchPropertyView
                features={features}
                fetching={fetching}
                handlePropertyClick={this.handlePropertyClick}
                activeProperty={activeProperty}
            />
        );
    }
}

export default SearchProperty;
