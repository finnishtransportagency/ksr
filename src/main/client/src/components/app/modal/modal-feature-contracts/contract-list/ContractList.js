// @flow
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { fetchContractRelation, unlinkContract } from '../../../../../api/contract/contractRelations';
import strings from '../../../../../translations';
import { contractListTexts } from '../../../../../utils/contracts/contracts';
import LoadingIcon from '../../../shared/LoadingIcon';
import ContractListView from './ContractListView';
import { nestedVal } from '../../../../../utils/nestedValue';
import { findFirstContractLayer } from '../../../../../utils/layers';

type Props = {
    objectId: number,
    currentLayer: Object,
    contractLayers: Object[],
    setActiveView: Function,
    editLayerPermission: boolean,
    showConfirmModal: (
        body: string,
        acceptText: string,
        cancelText: string,
        accept: Function,
    ) => void,
    setActiveModal: (activeModal: string, data: any) => void,
    updateLayerData: (layer: Object) => void,
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
            contractLayers,
        } = this.props;

        const contracts = await fetchContractRelation(
            currentLayer.id,
            objectId,
        );

        const contractList = [];
        if (contracts) {
            await contracts.map(async (c) => {
                const contractLayer = contractLayers.find(l => l.id === c.layerId);

                if (!contractLayer || c.features === null) return;
                const field = (contractLayer.fields !== undefined)
                    ? contractLayer.fields.find(
                        f => f.name === contractLayer.contractDescriptionField,
                    )
                    : undefined;
                const domain = (field !== undefined && field.domain !== null) ? {
                    type: field.domain.type,
                    name: field.domain.name,
                    description: field.domain.description,
                    codedValues: field.domain.codedValues,
                } : null;
                const contract = await contractListTexts(
                    c,
                    contractLayer ? contractLayer.contractIdField : '',
                    contractLayer ? contractLayer.contractDescriptionField : '',
                    contractLayer ? contractLayer.tiimeriLinkField : '',
                    contractLayer ? contractLayer.caseManagementLinkField : '',
                    nestedVal(contractLayer && contractLayer.relations.find(r => r), ['relationType'], false) === 'many',
                    domain,
                );
                if (contract.length > 0) {
                    contractList.push({
                        contract,
                        name: nestedVal(contractLayer, ['name'], ''),
                    });
                }
            });
        }

        // eslint-disable-next-line
        this.setState({
            contracts: contractList,
            fetchingContracts: false,
        });
    }

    handleUnlinkContract: any = (contractNumber: string, layerId: string) => {
        const {
            currentLayer,
            contractLayers,
            objectId,
            showConfirmModal,
            updateLayerData,
        } = this.props;

        const contractLayer: Object = contractLayers.find(c => c.id === layerId);

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

                const contractObject = contracts
                    .find(c => c.contract && c.contract
                        .some(a => a.id === contractNumber));

                const object = nestedVal(contractObject, ['contract'], {})
                    .find(a => a.id === contractNumber);
                const contractObjectId = nestedVal(
                    object,
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

                    const contractsReduced = contracts
                        .reduce((a, b) => {
                            const contractList = b.contract
                                .filter(c => c.id !== contractNumber);
                            if (contractList.length > 0) {
                                a.push({
                                    contract: contractList,
                                    name: b.name,
                                });
                            }
                            return a;
                        }, []);

                    this.setState({
                        contracts: contractsReduced,
                        fetchingContracts: false,
                    });

                    updateLayerData(currentLayer);
                } else {
                    toast.error(contractUnlinkError);
                    this.setState({ fetchingContracts: false });
                }
            },
        );
    };

    handleContractDetailsClick: any = async (contractNumber: number, layerId: string) => {
        const { contractLayers, setActiveModal } = this.props;
        const { contracts } = this.state;

        const contractLayer = contractLayers.find(c => c.id === layerId);

        const objectIdField = nestedVal(
            contractLayer
            && contractLayer.fields.find(field => field.type === 'esriFieldTypeOID'),
            ['label'],
        );

        const contractObject = contracts
            .find(c => c.contract && c.contract
                .some(a => a.id === contractNumber));

        const object = nestedVal(contractObject, ['contract'], {})
            .find(a => a.id === contractNumber);

        const contractObjectId = nestedVal(
            object,
            ['attributes', objectIdField],
        );

        const modalData = {
            contractObjectId,
            layerId: nestedVal(contractLayers.find(c => c.id === layerId), ['id']),
            source: 'contractModal',
        };

        setActiveModal('contractDetails', modalData);
    };

    render(): any {
        const { contracts, fetchingContracts } = this.state;
        const {
            setActiveView,
            editLayerPermission,
            contractLayers,
        } = this.props;

        const contractLayer: Object = findFirstContractLayer(contractLayers);

        return fetchingContracts
            ? (
                <LoadingIcon loading={fetchingContracts
                || (!contractLayer.fields)}
                />
            )
            : (
                <ContractListView
                    contracts={contracts}
                    handleUnlinkContract={this.handleUnlinkContract}
                    setActiveView={setActiveView}
                    editLayerPermission={editLayerPermission}
                    handleContractDetailsClick={this.handleContractDetailsClick}
                />
            );
    }
}

export default ContractList;
