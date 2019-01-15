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
    contractLinkLayer: Object,
    contractLayer: Object,
    alfrescoLinkField: string,
    caseManagementLinkField: string,
    setActiveView: Function,
    editLayerPermission: boolean,
    showConfirmModal: (
        body: string,
        acceptText: string,
        cancelText: string,
        accept: Function
    ) => void,
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
            currentLayer.id,
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

    handleUnlinkContract = (contractNumber: string) => {
        const {
            currentLayer,
            contractLinkLayer,
            contractLayer,
            objectId,
            contractIdField,
            contractDescriptionField,
            alfrescoLinkField,
            caseManagementLinkField,
            showConfirmModal,
        } = this.props;

        const {
            content, submit, cancel,
        } = strings.modalFeatureContracts.confirmModalUnlinkContract;
        showConfirmModal(
            content,
            submit,
            cancel,
            async () => {
                this.setState({ fetchingContracts: true });
                const {
                    contractUnlinked, contractUnlinkError,
                } = strings.modalFeatureContracts.linkContract;
                try {
                    const params = await getUnlinkParams(
                        contractLinkLayer,
                        contractLayer,
                        contractNumber,
                    );
                    const deletedFeatures = await deleteFeatures(
                        contractLinkLayer.id,
                        params,
                    );

                    const { deleteResults } = deletedFeatures;
                    if (deleteResults && deleteResults.length) {
                        let contracts = await fetchContractRelation(
                            currentLayer.id,
                            objectId,
                        );
                        contracts = await contractListTexts(
                            contracts,
                            contractIdField,
                            contractDescriptionField,
                            alfrescoLinkField,
                            caseManagementLinkField,
                        );

                        toast.success(contractUnlinked);
                        this.setState({
                            contracts,
                            fetchingContracts: false,
                        });
                    } else {
                        toast.error(contractUnlinkError);
                        this.setState({ fetchingContracts: false });
                    }
                } catch (error) {
                    toast.error(contractUnlinkError);
                    this.setState({ fetchingContracts: false });
                }
            },
        );
    };

    render() {
        const { contracts, fetchingContracts } = this.state;
        const {
            contractUnlinkable,
            setActiveView,
            editLayerPermission,
            contractLayer,
        } = this.props;

        return fetchingContracts
            ? <LoadingIcon loading={fetchingContracts || !contractLayer.fields} />
            : <ContractListView
                contracts={contracts}
                contractUnlinkable={contractUnlinkable}
                handleUnlinkContract={this.handleUnlinkContract}
                setActiveView={setActiveView}
                editLayerPermission={editLayerPermission}
            />;
    }
}

export default ContractList;
