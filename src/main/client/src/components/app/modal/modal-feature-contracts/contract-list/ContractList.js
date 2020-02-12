// @flow
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { fetchContractRelation, unlinkContract } from '../../../../../api/contract/contractRelations';
import strings from '../../../../../translations';
import { contractListTexts } from '../../../../../utils/contracts/contracts';
import LoadingIcon from '../../../shared/LoadingIcon';
import ContractListView from './ContractListView';
import { nestedVal } from '../../../../../utils/nestedValue';

type Props = {
    objectId: number,
    contractIdField: string,
    contractDescriptionField: string,
    contractUnlinkable: boolean,
    currentLayer: Object,
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
    setActiveModal: (activeModal: string, data: any) => void,
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
        this.handleContractDetailsClick = this.handleContractDetailsClick.bind(this);
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
            contractLayer,
            objectId,
            showConfirmModal,
        } = this.props;

        const objectIdField = nestedVal(
            contractLayer.fields.find(field => field.type === 'esriFieldTypeOID'),
            ['label'],
        );

        const {
            content, submit, cancel,
        } = strings.modalFeatureContracts.confirmModalUnlinkContract;
        showConfirmModal(
            content,
            submit,
            cancel,
            async () => {
                this.setState({ fetchingContracts: true });

                const { contracts } = this.state;

                const contractObjectId = nestedVal(
                    contracts.find(a => a.id === contractNumber),
                    ['attributes', objectIdField],
                );
                const unlinkSuccess = await unlinkContract(
                    currentLayer.id,
                    objectId,
                    contractLayer.id,
                    contractObjectId,
                );

                const {
                    contractUnlinked, contractUnlinkError,
                } = strings.modalFeatureContracts.linkContract;
                if (unlinkSuccess) {
                    toast.success(contractUnlinked);
                    this.setState({
                        contracts: contracts.filter(contract => contract.id !== contractNumber),
                        fetchingContracts: false,
                    });
                } else {
                    toast.error(contractUnlinkError);
                    this.setState({ fetchingContracts: false });
                }
            },
        );
    };

    handleContractDetailsClick = async (contractNumber: number) => {
        const { contractLayer, setActiveModal } = this.props;
        const { contracts } = this.state;

        const objectIdField = nestedVal(
            contractLayer.fields.find(field => field.type === 'esriFieldTypeOID'),
            ['label'],
        );

        const contractObjectId = nestedVal(
            contracts.find(a => a.id === contractNumber),
            ['attributes', objectIdField],
        );

        const modalData = {
            contractObjectId,
            layerId: contractLayer.id,
            source: 'contractModal',
        };

        setActiveModal('contractDetails', modalData);
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
            : (
                <ContractListView
                    contracts={contracts}
                    contractUnlinkable={contractUnlinkable}
                    handleUnlinkContract={this.handleUnlinkContract}
                    setActiveView={setActiveView}
                    editLayerPermission={editLayerPermission}
                    handleContractDetailsClick={this.handleContractDetailsClick}
                />
            );
    }
}

export default ContractList;
