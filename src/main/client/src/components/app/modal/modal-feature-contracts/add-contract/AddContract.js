// @flow
import React, { Component } from 'react';
import FeatureDetailsForm from '../../../shared/feature-details-form/FeatureDetailsForm';

type Props = {
    contractLayer: Object,
    setFormOptions: Function,
};

type State = {
    contractData: Array<Object>,
    fetching: boolean,
    contractExists: boolean,
    formOptions: Object,
};

const initialState = {
    contractData: [],
    fetching: false,
    contractExists: true,
    formOptions: {
        editedFields: [],
        submitDisabled: true,
    },
};

class AddContract extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = { ...initialState };
    }

    componentDidMount() {
        const { setFormOptions } = this.props;
        setFormOptions(initialState.formOptions);
    }

    render(): React$Element<(props: any) => any> {
        const { contractLayer, setFormOptions } = this.props;

        return (
            <FeatureDetailsForm
                layer={contractLayer}
                setFormOptions={setFormOptions}
                formType="add"
            />
        );
    }
}

export default AddContract;
