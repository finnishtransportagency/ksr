// @flow
import React, { Component } from 'react';
import { fetchContractRelation } from '../../../../../api/contract/contractRelations';
import LoadingIcon from '../../../shared/LoadingIcon';
import ContractListView from './ContractListView';

type Props = {
    layerId: number,
    objectId: number,
    contractIdField: string,
    contractDescriptionField: string,
};

type State = {
    contracts: Object[],
    fetchingContracts: boolean,
};

const initialState = {
    contracts: [],
    fetchingContracts: true,
};

class ContractList extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = { ...initialState };
    }

    componentDidMount() {
        const {
            layerId, objectId, contractIdField, contractDescriptionField,
        } = this.props;
        fetchContractRelation(layerId, objectId)
            .then((r) => {
                const contracts = r.features
                    ? r.features.map(feature => ({
                        id: feature.attributes[contractIdField],
                        description: feature.attributes[contractDescriptionField],
                    }))
                    : [];

                this.setState({
                    contracts,
                    fetchingContracts: false,
                });
            });
    }

    render() {
        const { contracts, fetchingContracts } = this.state;

        return fetchingContracts
            ? <LoadingIcon loading={fetchingContracts} />
            : <ContractListView contracts={contracts} fetchingContracts={fetchingContracts} />;
    }
}

export default ContractList;
