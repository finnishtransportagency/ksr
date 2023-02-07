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
import { findFirstContractLayer } from '../../../../utils/layers';

type Props = {
    removeContractListInfo: Function,
    objectId: number,
    currentLayer: Object,
    contractLayers: Object[],
    view: Object,
    createLayerPermission: boolean,
    editLayerPermission: boolean,
    updateLayerFields: (layerId: string, fields: Object[]) => void,
    updateLayerData: (layer: Object) => void;
};

type State = {
    activeView: string,
    title: string,
    modalSubmit: Object[],
    contractNumber: string,
    contractUuid: string,
    formOptions: Object,
    layerId: string,
};

class ModalFeatureContracts extends Component<Props, State> {
    modalSubmit: any; // eslint-disable-line react/sort-comp

    initialState: any; // eslint-disable-line react/sort-comp

    constructor(props: Props) {
        super(props);
        const {
            createLayerPermission, editLayerPermission, currentLayer, contractLayers,
        } = this.props;

        const modalSubmit = [];
        const relationsCurrentLayer = nestedVal(currentLayer, ['relations']);

        const containsLink = relationsCurrentLayer
            .some(r => contractLayers
                .some(c => r.relationLayerId.toString() !== c.id.toString()));

        if (createLayerPermission && containsLink) {
            modalSubmit.push({
                text: strings.modalFeatureContracts.submitNewContract,
                handleSubmit: this.handleSubmitAddContract,
                disabled: false,
                toggleModal: false,
            });
        }

        if (editLayerPermission && containsLink) {
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
            layerId: '',
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
        const { updateLayerFields, contractLayers } = this.props;
        const contractLayer = findFirstContractLayer(contractLayers);

        // Keep link- and add buttons disabled until contract layer fields queried.
        if (contractLayer && !nestedVal(contractLayer, ['fields'])) {
            // eslint-disable-next-line
            this.setState({
                modalSubmit: modalSubmit.map(ms => ({
                    ...ms,
                    disabled: !nestedVal(contractLayer, ['fields']),
                })),
            });

            if (!nestedVal(contractLayers.find(c => c), ['fields'])) {
                contractLayers.map(async (l: Object) => {
                    const { id, fields } = await getSingleLayerFields(l);
                    updateLayerFields(id, fields);
                });
            }

            // eslint-disable-next-line
            this.setState({ ...this.initialState });
        }
    }

    handleGoBack: any = () => {
        this.setState({ ...this.initialState });
    };

    handleModalCancel: any = () => {
        const { removeContractListInfo } = this.props;
        removeContractListInfo();
    };

    handleSubmitLinkToContract: any = () => {
        const {
            objectId, currentLayer, contractLayers, view, updateLayerData,
        } = this.props;
        const contractLayer: Object = findFirstContractLayer(contractLayers);
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

                    if (nestedVal(contractLayer.relations.find(r => r), ['relationType']) === 'many') {
                        await linkToContract(
                            contractNumber,
                            currentLayer,
                            objectId,
                            contractLayer,
                        );
                    } else {
                        await updateContractLink(contractNumber, currentLayer, objectId, view);
                    }
                    updateLayerData(currentLayer);

                    this.setState({ ...this.initialState });
                },
                disabled: true,
                toggleModal: false,
            }],
        });
    };

    handleSubmitEditContract: any = async () => {
        const {
            view, contractLayers, updateLayerData,
        } = this.props;
        const { layerId } = this.state;
        const contractLayer = contractLayers.find(c => c.id === layerId);

        const objectIdField = nestedVal(contractLayer, ['fields'], {})
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
                false,
                this.state.formOptions.editedFields[objectIdFieldName],
            );
            updateLayerData(contractLayer);

            this.setState({ ...this.initialState });
        }
    };

    handleSubmitAddContract: any = () => {
        const {
            objectId, currentLayer, contractLayers, view, updateLayerData,
        } = this.props;
        const contractLayer: Object = findFirstContractLayer(contractLayers);
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
                        false,
                        false,
                    );

                    if (res && res.addResults) {
                        const { contractNumber } = this.state;

                        if (nestedVal(currentLayer.relations.find(c => c), ['relationType']) === 'many') {
                            await linkToContract(
                                this.state.formOptions.editedFields[contractLayer.contractIdField],
                                currentLayer,
                                objectId,
                                contractLayer,
                            );
                        } else {
                            await updateContractLink(contractNumber, currentLayer, objectId, view);
                        }
                        updateLayerData(contractLayer);
                    }
                    this.setState({ ...this.initialState });
                },
                disabled: true,
                toggleModal: false,
            }],
        });
    };

    contractLinkValidation: any = (
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

    setActiveView: any = (activeView: string, contractNumber: string, layerId: string) => {
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
            layerId,
        });
    };

    setFormOptions: any = (formOptions: Object) => {
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

    render(): React$Element<any> {
        const { contractLayers, currentLayer } = this.props;
        const {
            activeView, title, modalSubmit, contractNumber, layerId,
        } = this.state;

        return (
            <ModalContainer
                modalSubmit={modalSubmit}
                title={title}
                handleModalCancel={this.handleModalCancel}
                cancelText={activeView !== 'contractList'
                    ? strings.modalFeatureContracts.backText
                    : strings.modalFeatureContracts.cancelText}
                handleGoBack={activeView !== 'contractList'
                    ? () => {
                        this.handleGoBack();
                    }
                    : null}
            >
                <>
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
                            contractLayer={findFirstContractLayer(contractLayers)}
                            setFormOptions={this.setFormOptions}
                        />
                    )}
                    {activeView === 'editContract'
                    && (
                        <EditContractContainer
                            contractLayer={contractLayers.find(c => c.id === layerId)}
                            currentLayer={currentLayer}
                            setFormOptions={this.setFormOptions}
                            contractNumber={contractNumber}
                            fields={nestedVal(contractLayers.find(c => c.id === layerId), ['fields'])}
                        />
                    )}
                </>
            </ModalContainer>
        );
    }
}

export default ModalFeatureContracts;
