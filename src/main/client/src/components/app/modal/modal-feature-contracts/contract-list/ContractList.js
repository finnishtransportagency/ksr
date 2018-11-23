// @flow
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { fetchContractRelation } from '../../../../../api/contract/contractRelations';
import { deleteFeatures } from '../../../../../api/map/deleteFeatures';
import strings from '../../../../../translations';
import { contractListTexts, getUnlinkParams } from '../../../../../utils/contracts/contracts';
import LoadingIcon from '../../../shared/LoadingIcon';
import ContractListView from './ContractListView';

type Props = {
    objectId: number,
    contractIdField: string,
    contractDescriptionField: string,
    contractUnlinkable: boolean,
    currentLayer: Object,
    relationLayer: Object,
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

        this.handleUnlinkContract = this.handleUnlinkContract.bind(this);
    }

    componentDidMount() {
        const {
            currentLayer, objectId, contractIdField, contractDescriptionField,
        } = this.props;

        fetchContractRelation(
            currentLayer.id,
            objectId,
        ).then(contracts => contractListTexts(contracts, contractIdField, contractDescriptionField))
            .then((contracts) => {
                this.setState({
                    contracts,
                    fetchingContracts: false,
                });
            });
    }

    handleUnlinkContract = async (contractNumber: number) => {
        const {
            currentLayer,
            relationLayer,
            objectId,
            contractIdField,
            contractDescriptionField,
        } = this.props;

        this.setState({ fetchingContracts: true });

        try {
            const params = await getUnlinkParams(currentLayer, relationLayer, contractNumber);
            const deletedFeatures = await deleteFeatures(relationLayer.id, params);

            if (deletedFeatures.deleteResults.length) {
                toast.success(strings.modalFeatureContracts.linkContract.contractUnlinked);
                const contracts = await fetchContractRelation(
                    currentLayer.id,
                    objectId,
                ).then(res => contractListTexts(res, contractIdField, contractDescriptionField));

                this.setState({
                    contracts,
                    fetchingContracts: false,
                });
            } else {
                toast.error(strings.modalFeatureContracts.linkContract.contractUnlinkError);
                this.setState({ fetchingContracts: false });
            }
        } catch (error) {
            toast.error(strings.modalFeatureContracts.linkContract.contractUnlinkError);
            this.setState({ fetchingContracts: false });
        }
    };

    render() {
        const { contracts, fetchingContracts } = this.state;
        const { contractUnlinkable } = this.props;

        return fetchingContracts
            ? <LoadingIcon loading={fetchingContracts} />
            : <ContractListView
                contracts={contracts}
                contractUnlinkable={contractUnlinkable}
                handleUnlinkContract={this.handleUnlinkContract}
            />;
    }
}

export default ContractList;
