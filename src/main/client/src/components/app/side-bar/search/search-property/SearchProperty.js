// @flow
import React, { Component } from 'react';
import { zoomToProperty } from '../../../../../utils/map';
import SearchPropertyView from './SearchPropertyView';

type Props = {
    features: Object[],
    fetching: boolean,
    handleSubmit: Function,
    view: Object,
    authorities: Object[],
    handleClear: Function,
}

type State = {
    activeProperty: string,
    submitDisabled: boolean,
    propertyId: string,
};

const initialState = {
    activeProperty: '',
    submitDisabled: true,
    propertyId: '',
};

class SearchProperty extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = { ...initialState };
    }

    onSubmit = (evt: Object) => {
        const {
            handleSubmit,
            view,
            authorities,
        } = this.props;
        const { propertyId } = this.state;
        evt.preventDefault();
        handleSubmit(propertyId, view, 'propertyArea', authorities);
    };

    onClear = (evt: Object) => {
        evt.preventDefault();
        const { handleClear, view } = this.props;
        handleClear('propertyArea', view);
    };

    validatePropertyId = (propertyId: string) => {
        if (typeof propertyId !== 'string') {
            return false;
        }
        const zeroRegexp = RegExp(/^([0-9]{14})$/g);
        const hyphenRegexp = RegExp(/^([0-9]{1,3}-[0-9]{1,3}-[0-9]{1,4}-[0-9]{1,4})$/g);
        return zeroRegexp.test(propertyId) || hyphenRegexp.test(propertyId);
    };

    handlePropertyIdChange = (evt: Object) => {
        const propertyId = evt.target.value;
        const valid = this.validatePropertyId(propertyId);

        this.setState({
            submitDisabled: !valid,
            propertyId,
        });
    };

    handlePropertyClick = (id: string) => {
        const { activeProperty } = this.state;

        if (activeProperty === id) {
            this.setState({ activeProperty: initialState.activeProperty });
        } else {
            this.setState({ activeProperty: id });
        }
    };

    handlePropertyZoomClick = (id: string) => {
        const { view, features } = this.props;
        const foundProperty = features.find(property => property.id === id);
        if (foundProperty) zoomToProperty(view, id);
    };

    render() {
        const { activeProperty, submitDisabled, propertyId } = this.state;
        const {
            fetching,
            features,
        } = this.props;

        return (
            <SearchPropertyView
                propertyId={propertyId}
                features={features}
                fetching={fetching}
                handlePropertyClick={this.handlePropertyClick}
                handlePropertyZoomClick={this.handlePropertyZoomClick}
                activeProperty={activeProperty}
                submitDisabled={submitDisabled}
                handlePropertyIdChange={this.handlePropertyIdChange}
                handleSubmit={this.onSubmit}
                handleClear={this.onClear}
            />
        );
    }
}

export default SearchProperty;
