// @flow
import React, { Component } from 'react';
import { fetchContractRelation } from '../../../../../api/contract/contractRelations';
import FeatureDetailsForm from '../../../shared/feature-details-form/FeatureDetailsForm';
import LoadingIcon from '../../../shared/LoadingIcon';

type Props = {
    currentLayer: Object,
    contractLayer: Object,
    fields: Array<Object>,
    objectId: number,
    contractNumber: string,
    setFormOptions: (formOptions: Object) => void,
};

type State = {
    contractData: Array<Object>,
    fetching: boolean,
    contractExists: boolean,
    formOptions: Object,
    existingAttributes: Object,
};

const initialState = {
    contractData: [],
    fetching: true,
    contractExists: true,
    formOptions: {
        editedFields: [],
        submitDisabled: true,
    },
    existingAttributes: {},
};

class EditContract extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = { ...initialState };
    }

    async componentDidMount() {
        const { setFormOptions } = this.props;
        setFormOptions(initialState.formOptions);
        await this.loadExistingAttributes();
    }

    loadExistingAttributes = async () => {
        const {
            currentLayer, objectId, fields, contractLayer, contractNumber,
        } = this.props;

        const contracts = await fetchContractRelation(
            currentLayer.id,
            objectId,
        );

        if (!contracts || !contracts.length || contracts.length < 1) return;

        const contract = contracts
            .reduce((arr, c) => arr.concat(c.features), [])
            .find(f => f && f.attributes
                && f.attributes[contractLayer.contractIdField] === contractNumber);

        const attributes = fields
            .map(
                field => ({
                    ...field,
                    data: contract
                        ? contract.attributes[field.name]
                        : contracts.find(c => c)[0].attributes[field.name],
                }),
                {},
            );

        const existingAttributes = attributes.reduce((acc, attr) => ({
            ...acc,
            [attr.name]: attr.data,
        }), {});

        this.setState({
            existingAttributes,
            fetching: false,
        });
    };

    render() {
        const { contractLayer, setFormOptions } = this.props;
        const { fetching, existingAttributes } = this.state;

        if (fetching) {
            return <LoadingIcon loading={fetching} />;
        }

        return (
            <FeatureDetailsForm
                layer={contractLayer}
                setFormOptions={setFormOptions}
                formType="edit"
                existingAttributes={existingAttributes}
            />
        );
    }
}

export default EditContract;
