// @flow
import React, { Component, Fragment } from 'react';
import strings from '../../../../translations';
import { linkToContract } from '../../../../utils/contracts/contracts';
import ModalContainer from '../../shared/Modal/ModalContainer';
import ContractListContainer from './contract-list/ContractListContainer';
import LinkContractContainer from './link-contract/LinkContractContainer';

type Props = {
    removeContractListInfo: Function,
    objectId: number,
    currentLayer: Object,
};

type State = {
    activeView: string,
    title: string,
    validContractLink: boolean,
    modalSubmit: Object[],
    contractNumber: ?number,
    contractUpdateLayer: Object,
    contractUuid: string,
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
                handleSubmit: () => {},
                disabled: true,
                toggleModal: false,
            }, {
                text: strings.modalFeatureContracts.submitLinkToContract,
                handleSubmit: this.handleSubmitLinkToContract,
                disabled: false,
                toggleModal: false,
            }],
            contractNumber: null,
            contractUpdateLayer: {},
            contractUuid: '',
        };

        this.initialState = this.state;

        this.handleSubmitLinkToContract = this.handleSubmitLinkToContract.bind(this);
        this.handleGoBack = this.handleGoBack.bind(this);
        this.handleModalCancel = this.handleModalCancel.bind(this);
        this.contractLinkValidation = this.contractLinkValidation.bind(this);
    }

    handleGoBack = () => {
        this.setState({ ...this.initialState });
    };

    handleModalCancel = () => {
        const { removeContractListInfo } = this.props;
        removeContractListInfo();
    };

    handleSubmitLinkToContract = () => {
        const { objectId, currentLayer } = this.props;
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
                        this.state.contractUpdateLayer,
                        this.state.contractUuid,
                        objectId,
                        currentLayer,
                    );
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
        contractUpdateLayer?: Object,
        contractUuid?: string,
    ) => {
        if (validContract) {
            this.setState({
                ...this.state,
                contractNumber,
                contractUpdateLayer,
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
                contractUpdateLayer: {},
                contractUuid: '',
                modalSubmit: this.state.modalSubmit.map(ms => ({
                    ...ms,
                    disabled: true,
                })),
            });
        }
    };

    render() {
        const { activeView, title, modalSubmit } = this.state;

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
                    {activeView === 'contractList' && <ContractListContainer />}
                    {activeView === 'linkContract' && <LinkContractContainer contractLinkValidation={this.contractLinkValidation} />}
                </Fragment>
            </ModalContainer>
        );
    }
}

export default ModalFeatureContracts;
