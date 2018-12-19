// @flow
import React, { Component, Fragment } from 'react';
import strings from '../../../../translations';
import { linkToContract } from '../../../../utils/contracts/contracts';
import ModalContainer from '../../shared/Modal/ModalContainer';
import ContractListContainer from './contract-list/ContractListContainer';
import LinkContractContainer from './link-contract/LinkContractContainer';
import AddContractContrainer from './add-contract/AddContractContainer';
import save from '../../../../utils/saveFeatureData';
import EditContractContainer from './edit-contract/EditContractContainer';
import { nestedVal } from '../../../../utils/nestedValue';

type Props = {
    removeContractListInfo: Function,
    objectId: number,
    currentLayer: Object,
    contractLinkLayer: Object,
    contractLayer: Object,
    view: Object,
    createLayerPermission: boolean,
    editLayerPermission: boolean,
    addUpdateLayers: Function,
};

type State = {
    activeView: string,
    title: string,
    validContractLink: boolean,
    modalSubmit: Object[],
    contractNumber: ?number,
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
            contractNumber: null,
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

    handleGoBack = () => {
        this.setState({ ...this.initialState });
    };

    handleModalCancel = () => {
        const { removeContractListInfo } = this.props;
        removeContractListInfo();
    };

    handleSubmitLinkToContract = () => {
        const {
            objectId, currentLayer, contractLinkLayer, addUpdateLayers, view,
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
                    await linkToContract(
                        this.state.contractNumber,
                        contractLinkLayer || currentLayer,
                        this.state.contractUuid,
                        objectId,
                        currentLayer,
                        addUpdateLayers,
                        view,
                    );
                    this.setState({ ...this.initialState });
                },
                disabled: true,
                toggleModal: false,
            }],
        });
    };

    handleSubmitEditContract = async () => {
        const { view, contractLayer } = this.props;
        await save.saveData('update', view, nestedVal(contractLayer, ['id']), [this.state.data]);
        this.setState({ ...this.initialState });
    };

    handleSubmitAddContract = () => {
        const {
            objectId, currentLayer, contractLinkLayer, contractLayer, addUpdateLayers, view,
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
                    const res = await save.saveData(
                        'add',
                        view,
                        nestedVal(contractLayer, ['id']),
                        [this.state.data],
                    );
                    if (res && res.addResults) {
                        await linkToContract(
                            this.state.contractNumber,
                            contractLinkLayer || currentLayer,
                            this.state.contractUuid,
                            objectId,
                            currentLayer,
                            addUpdateLayers,
                            view,
                        );
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
        contractNumber?: number,
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
                contractNumber: null,
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

    setActiveView = (activeView: string, contractNumber: number) => {
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
