// @flow
import React, { Component, Fragment } from 'react';
import strings from '../../../../translations';
import ModalContainer from '../../shared/Modal/ModalContainer';
import ContractListContainer from './contract-list/ContractListContainer';
import LinkContractView from './modal-feature-contracts-views/LinkContractView';

type Props = {
    removeContractListInfo: Function,
};

type State = {
    activeView: string,
    title: string,
};

const initialState = {
    activeView: 'contractList',
    title: strings.modalFeatureContracts.listView.title,
};

class ModalFeatureContracts extends Component<Props, State> {
    modalSubmit: any; // eslint-disable-line react/sort-comp
    initialModalSubmit: any; // eslint-disable-line react/sort-comp

    constructor(props: Props) {
        super(props);

        this.state = { ...initialState };

        this.modalSubmit = [{
            text: strings.modalFeatureContracts.submitNewContract,
            handleSubmit: () => {},
            disabled: true,
            toggleModal: false,
        }, {
            text: strings.modalFeatureContracts.submitLinkToContract,
            handleSubmit: this.handleSubmitLinkToContract,
            disabled: false,
            toggleModal: false,
        }];
        this.initialModalSubmit = this.modalSubmit;

        this.handleSubmitLinkToContract = this.handleSubmitLinkToContract.bind(this);
        this.handleGoBack = this.handleGoBack.bind(this);
        this.handleModalCancel = this.handleModalCancel.bind(this);
    }

    handleGoBack = () => {
        this.modalSubmit = this.initialModalSubmit;
        this.setState({ ...initialState });
    };

    handleModalCancel = () => {
        const { removeContractListInfo } = this.props;
        removeContractListInfo();
    };

    handleSubmitLinkToContract = () => {
        this.setState({
            activeView: 'linkContract',
            title: strings.modalFeatureContracts.titleLinkContract,
        });

        this.modalSubmit = [{
            text: strings.modalFeatureContracts.submitLinkContract,
            handleSubmit: () => {},
            disabled: true,
            toggleModal: false,
        }];
    };

    render() {
        const { activeView, title } = this.state;

        return (
            <ModalContainer
                modalSubmit={this.modalSubmit}
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
                    {activeView === 'linkContract' && <LinkContractView />}
                </Fragment>
            </ModalContainer>
        );
    }
}

export default ModalFeatureContracts;
