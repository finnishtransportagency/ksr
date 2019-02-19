// @flow
import React, { Component, Fragment } from 'react';
import strings from '../../../../translations';
import { linkToContract, updateContractLink } from '../../../../utils/contracts/contracts';
import ModalContainer from '../../shared/Modal/ModalContainer';
import ContractListContainer from './contract-list/ContractListContainer';
import LinkContractContainer from './link-contract/LinkContractContainer';
import AddContractContrainer from './add-contract/AddContractContainer';
import save from '../../../../utils/saveFeatureData';
import EditContractContainer from './edit-contract/EditContractContainer';
import { nestedVal } from '../../../../utils/nestedValue';
import { getSingleLayerFields } from '../../../../utils/map';

type Props = {
    removeContractListInfo: Function,
    objectId: number,
    currentLayer: Object,
    contractLayer: Object,
    view: Object,
    createLayerPermission: boolean,
    editLayerPermission: boolean,
    updateLayerFields: (layerId: string, fields: Object[]) => void,
};

type State = {
    activeView: string,
    title: string,
    validContractLink: boolean,
    modalSubmit: Object[],
    contractNumber: string,
    contractUuid: string,
    data: Object,
};

class ModalFeatureContracts extends Component<Props, State> {
    modalSubmit: any; // eslint-disable-line react/sort-comp
    initialState: any; // eslint-disable-line react/sort-comp

    constructor(props: Props) {
        super(props);

        this.state = {
            activeView: 'contractList',
            title: strings.modalFeatureContracts.listView.title,
            validContractLink: false,
            modalSubmit: [{
                text: strings.modalFeatureContracts.submitNewContract,
                handleSubmit: this.handleSubmitAddContract,
                disabled: !this.props.createLayerPermission,
                toggleModal: false,
            },
            {
                text: strings.modalFeatureContracts.submitLinkToContract,
                handleSubmit: this.handleSubmitLinkToContract,
                disabled: !this.props.editLayerPermission,
                toggleModal: false,
            }],
            contractNumber: '',
            contractUpdateLayer: {},
            contractUuid: '',
            data: {},
        };

        this.initialState = this.state;

        this.handleSubmitAddContract = this.handleSubmitAddContract.bind(this);
        this.handleSubmitEditContract = this.handleSubmitEditContract.bind(this);
        this.handleSubmitLinkToContract = this.handleSubmitLinkToContract.bind(this);
        this.handleGoBack = this.handleGoBack.bind(this);
        this.handleModalCancel = this.handleModalCancel.bind(this);
        this.contractLinkValidation = this.contractLinkValidation.bind(this);
        this.setData = this.setData.bind(this);
        this.setActiveView = this.setActiveView.bind(this);
    }

    async componentDidMount() {
        const { updateLayerFields, contractLayer } = this.props;

        // Keep link- and add buttons disabled until contract layer fields queried.
        if (contractLayer && !contractLayer.fields) {
            // eslint-disable-next-line
            this.setState({
                modalSubmit: this.state.modalSubmit.map(ms => ({
                    ...ms,
                    disabled: !this.props.createLayerPermission || !this.props.contractLayer.fields,
                })),
            });

            if (!contractLayer.fields) {
                const { id, fields } = await getSingleLayerFields(contractLayer);
                updateLayerFields(id, fields);
            }

            // eslint-disable-next-line
            this.setState({ ...this.initialState });
        }
    }

    handleGoBack = () => {
        this.setState({ ...this.initialState });
    };

    handleModalCancel = () => {
        const { removeContractListInfo } = this.props;
        removeContractListInfo();
    };

    handleSubmitLinkToContract = () => {
        const {
            objectId, currentLayer, contractLayer, view,
        } = this.props;
        this.setState({
            activeView: 'linkContract',
            title: strings.modalFeatureContracts.linkContract.title,
            modalSubmit: [{
                text: strings.modalFeatureContracts.linkContract.submit,
                handleSubmit: async () => {
                    this.setState({
                        ...this.state,
                        modalSubmit: this.state.modalSubmit.map(ms => ({
                            ...ms,
                            disabled: true,
                        })),
                    });

                    const { contractNumber } = this.state;

                    if (currentLayer.relationType === 'many') {
                        await linkToContract(
                            contractNumber,
                            currentLayer,
                            objectId,
                            contractLayer,
                        );
                    } else {
                        await updateContractLink(contractNumber, currentLayer, objectId, view);
                    }

                    this.setState({ ...this.initialState });
                },
                disabled: true,
                toggleModal: false,
            }],
        });
    };

    handleSubmitEditContract = async () => {
        const {
            view, contractLayer,
        } = this.props;
        const objectIdField = contractLayer.fields
            .find(field => field.type === 'esriFieldTypeOID');
        if (objectIdField) {
            const objectIdFieldName = objectIdField.name;
            const objectId = this.state.data.attributes[objectIdFieldName];

            await save.saveData(
                'update',
                view,
                nestedVal(contractLayer, ['id']),
                [this.state.data],
                objectIdFieldName,
                objectId,
            );

            this.setState({ ...this.initialState });
        }
    };

    handleSubmitAddContract = () => {
        const {
            objectId, currentLayer, contractLayer, view,
        } = this.props;
        this.setState({
            activeView: 'addContract',
            title: strings.modalFeatureContracts.titleNewContract,
            modalSubmit: [{
                text: strings.modalFeatureContracts.submitSave,
                handleSubmit: async () => {
                    this.setState({
                        ...this.state,
                        modalSubmit: this.state.modalSubmit.map(ms => ({
                            ...ms,
                            disabled: true,
                        })),
                    });
                    const objectIdField = contractLayer.fields
                        .find(field => field.type === 'esriFieldTypeOID');
                    const objectIdFieldName = objectIdField.name;

                    const res = await save.saveData(
                        'add',
                        view,
                        nestedVal(contractLayer, ['id']),
                        [this.state.data],
                        objectIdFieldName,
                        undefined,
                        false,
                        false,
                    );
                    if (res && res.addResults) {
                        const { contractNumber } = this.state;

                        if (currentLayer.relationType === 'many') {
                            await linkToContract(
                                contractNumber,
                                currentLayer,
                                objectId,
                                contractLayer,
                            );
                        } else {
                            await updateContractLink(contractNumber, currentLayer, objectId, view);
                        }
                    }
                    this.setState({ ...this.initialState });
                },
                disabled: true,
                toggleModal: false,
            }],
        });
    };

    contractLinkValidation = (
        validContract?: boolean,
        contractNumber?: string,
        contractUuid?: string,
    ) => {
        if (validContract) {
            this.setState({
                ...this.state,
                contractNumber,
                contractUuid,
                modalSubmit: this.state.modalSubmit.map(ms => ({
                    ...ms,
                    disabled: false,
                })),
            });
        } else {
            this.setState({
                ...this.state,
                contractNumber: '',
                contractUuid: '',
                modalSubmit: this.state.modalSubmit.map(ms => ({
                    ...ms,
                    disabled: true,
                })),
            });
        }
    };

    setData = (values: Object) => {
        const { data } = Object.assign({}, this.state);
        data.attributes = values;
        this.setState({
            ...this.state,
            data,
        });
    };

    setActiveView = (activeView: string, contractNumber: string) => {
        this.setState({
            ...this.state,
            activeView,
            title: strings.modalFeatureContracts.titleEditContract,
            modalSubmit: [{
                text: strings.modalFeatureContracts.submitSave,
                handleSubmit: this.handleSubmitEditContract,
                disabled: false,
                toggleModal: false,
            }],
            contractNumber,
        });
    };

    render() {
        const {
            activeView, title, modalSubmit, contractNumber,
        } = this.state;

        return (
            <ModalContainer
                modalSubmit={modalSubmit}
                title={title}
                handleModalCancel={this.handleModalCancel}
                cancelText={activeView !== 'contractList'
                    ? strings.modalFeatureContracts.backText
                    : strings.modalFeatureContracts.cancelText
                }
                handleGoBack={activeView !== 'contractList'
                    ? () => { this.handleGoBack(); }
                    : null
                }
            >
                <Fragment>
                    {activeView === 'contractList' && <ContractListContainer setActiveView={this.setActiveView} />}
                    {activeView === 'linkContract' && <LinkContractContainer contractLinkValidation={this.contractLinkValidation} />}
                    {activeView === 'addContract' && <AddContractContrainer contractLinkValidation={this.contractLinkValidation} setData={this.setData} />}
                    {activeView === 'editContract' && <EditContractContainer contractLinkValidation={this.contractLinkValidation} setData={this.setData} contractNumber={contractNumber} />}
                </Fragment>
            </ModalContainer>
        );
    }
}

export default ModalFeatureContracts;
