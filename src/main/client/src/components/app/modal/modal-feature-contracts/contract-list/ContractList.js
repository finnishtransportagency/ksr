// @flow
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { fetchContractRelation } from '../../../../../api/contract/contractRelations';
import { deleteFeatures } from '../../../../../api/map/deleteFeatures';
import strings from '../../../../../translations';
import { contractListTexts, getUnlinkParams } from '../../../../../utils/contracts/contracts';
import { nestedVal } from '../../../../../utils/nestedValue';
import LoadingIcon from '../../../shared/LoadingIcon';
import ContractListView from './ContractListView';

type Props = {
    objectId: number,
    contractIdField: string,
    contractDescriptionField: string,
    contractUnlinkable: boolean,
    currentLayer: Object,
    relationLayer: Object,
    alfrescoLinkField: string,
    caseManagementLinkField: string,
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

    async componentDidMount() {
        const {
            currentLayer,
            objectId,
            contractIdField,
            contractDescriptionField,
            alfrescoLinkField,
            caseManagementLinkField,
        } = this.props;

        let contracts = await fetchContractRelation(
            nestedVal(currentLayer, ['id']),
            objectId,
        );
        contracts = await contractListTexts(
            contracts,
            contractIdField,
            contractDescriptionField,
            alfrescoLinkField,
            caseManagementLinkField,
        );

        // eslint-disable-next-line
        this.setState({
            contracts,
            fetchingContracts: false,
        });
    }

    handleUnlinkContract = async (contractNumber: number) => {
        const {
            currentLayer,
            relationLayer,
            objectId,
            contractIdField,
            contractDescriptionField,
            alfrescoLinkField,
            caseManagementLinkField,
        } = this.props;

        this.setState({ fetchingContracts: true });

        try {
            const params = await getUnlinkParams(currentLayer, relationLayer, contractNumber);
            const deletedFeatures = await deleteFeatures(
                nestedVal(relationLayer, ['id']),
                params,
            );

            const deleteResults = nestedVal(deletedFeatures, ['deleteResults']);
            if (deleteResults.length) {
                let contracts = await fetchContractRelation(
                    nestedVal(currentLayer, ['id']),
                    objectId,
                );
                contracts = await contractListTexts(
                    contracts,
                    contractIdField,
                    contractDescriptionField,
                    alfrescoLinkField,
                    caseManagementLinkField,
                );

                toast.success(strings.modalFeatureContracts.linkContract.contractUnlinked);
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
        const {
            contractUnlinkable, alfrescoLinkField, caseManagementLinkField,
        } = this.props;

        return fetchingContracts
            ? <LoadingIcon loading={fetchingContracts} />
            : <ContractListView
                contracts={contracts}
                contractUnlinkable={contractUnlinkable}
                handleUnlinkContract={this.handleUnlinkContract}
                alfrescoLink={alfrescoLinkField}
                caseManagementLink={caseManagementLinkField}
            />;
    }
}

export default ContractList;
