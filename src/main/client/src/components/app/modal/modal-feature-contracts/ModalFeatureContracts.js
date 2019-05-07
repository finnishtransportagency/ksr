// @flow
import React, { Component, Fragment } from 'react';
import strings from '../../../../translations';
import { linkToContract, updateContractLink } from '../../../../utils/contracts/contracts';
import ModalContainer from '../../shared/Modal/ModalContainer';
import ContractListContainer from './contract-list/ContractListContainer';
import LinkContractContainer from './link-contract/LinkContractContainer';
import save from '../../../../utils/saveFeatureData';
import EditContractContainer from './edit-contract/EditContractContainer';
import { nestedVal } from '../../../../utils/nestedValue';
import { getSingleLayerFields } from '../../../../utils/map';
import AddContract from './add-contract/AddContract';

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
    modalSubmit: Object[],
    contractNumber: string,
    contractUuid: string,
    formOptions: Object,
};

class ModalFeatureContracts extends Component<Props, State> {
    modalSubmit: any; // eslint-disable-line react/sort-comp

    initialState: any; // eslint-disable-line react/sort-comp

    constructor(props: Props) {
        super(props);
        const { createLayerPermission, editLayerPermission } = this.props;

        const modalSubmit = [];
        if (createLayerPermission) {
            modalSubmit.push({
                text: strings.modalFeatureContracts.submitNewContract,
                handleSubmit: this.handleSubmitAddContract,
                disabled: false,
                toggleModal: false,
            });
        }

        if (editLayerPermission) {
            modalSubmit.push({
                text: strings.modalFeatureContracts.submitLinkToContract,
                handleSubmit: this.handleSubmitLinkToContract,
                disabled: false,
                toggleModal: false,
            });
        }

        this.state = {
            activeView: 'contractList',
            title: strings.modalFeatureContracts.listView.title,
            modalSubmit,
            contractNumber: '',
            contractUpdateLayer: {},
            contractUuid: '',
            formOptions: {
                editedFields: [],
                submitDisabled: true,
            },
        };

        this.initialState = this.state;

        this.handleSubmitAddContract = this.handleSubmitAddContract.bind(this);
        this.handleSubmitEditContract = this.handleSubmitEditContract.bind(this);
        this.handleSubmitLinkToContract = this.handleSubmitLinkToContract.bind(this);
        this.handleGoBack = this.handleGoBack.bind(this);
        this.handleModalCancel = this.handleModalCancel.bind(this);
        this.contractLinkValidation = this.contractLinkValidation.bind(this);
        this.setActiveView = this.setActiveView.bind(this);
    }

    async componentDidMount() {
        const { modalSubmit } = this.state;
        const { updateLayerFields, contractLayer } = this.props;

        // Keep link- and add buttons disabled until contract layer fields queried.
        if (contractLayer && !contractLayer.fields) {
            // eslint-disable-next-line
            this.setState({
                modalSubmit: modalSubmit.map(ms => ({
                    ...ms,
                    disabled: !contractLayer.fields,
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
        const { view, contractLayer } = this.props;

        const objectIdField = contractLayer.fields
            .find(field => field.type === 'esriFieldTypeOID');
        if (objectIdField) {
            this.setState({
                ...this.state,
                modalSubmit: this.state.modalSubmit.map(ms => ({
                    ...ms,
                    disabled: true,
                })),
            });

            const objectIdFieldName = objectIdField.name;

            await save.saveData(
                'update',
                view,
                nestedVal(contractLayer, ['id']),
                [{
                    attributes: this.state.formOptions.editedFields,
                }],
                objectIdFieldName,
                this.state.formOptions.editedFields[objectIdFieldName],
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
                        [{ attributes: this.state.formOptions.editedFields }],
                        objectIdFieldName,
                        undefined,
                        false,
                        false,
                    );

                    if (res && res.addResults) {
                        const { contractNumber } = this.state;

                        if (currentLayer.relationType === 'many') {
                            await linkToContract(
                                this.state.formOptions.editedFields[contractLayer.contractIdField],
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
        const { modalSubmit } = this.state;

        if (validContract) {
            this.setState({
                ...this.state,
                contractNumber,
                contractUuid,
                modalSubmit: modalSubmit.map(ms => ({
                    ...ms,
                    disabled: false,
                })),
            });
        } else {
            this.setState({
                ...this.state,
                contractNumber: '',
                contractUuid: '',
                modalSubmit: modalSubmit.map(ms => ({
                    ...ms,
                    disabled: true,
                })),
            });
        }
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

    setFormOptions = (formOptions: Object) => {
        const { modalSubmit } = this.state;
        this.setState({
            formOptions: {
                editedFields: formOptions.editedFields,
                submitDisabled: formOptions.submitDisabled,
            },
            modalSubmit: modalSubmit.map(ms => ({
                ...ms,
                disabled: formOptions.submitDisabled,
            })),
        });
    };

    render() {
        const { contractLayer } = this.props;
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
                    {activeView === 'contractList' && (
                        <ContractListContainer
                            setActiveView={this.setActiveView}
                        />
                    )}
                    {activeView === 'linkContract'
                    && (
                        <LinkContractContainer
                            contractLinkValidation={this.contractLinkValidation}
                        />
                    )}
                    {activeView === 'addContract'
                    && (
                        <AddContract
                            contractLayer={contractLayer}
                            setFormOptions={this.setFormOptions}
                        />
                    )}
                    {activeView === 'editContract'
                    && (
                        <EditContractContainer
                            contractLayer={contractLayer}
                            setFormOptions={this.setFormOptions}
                            contractNumber={contractNumber}
                        />
                    )}
                </Fragment>
            </ModalContainer>
        );
    }
}

export default ModalFeatureContracts;
