// @flow
import React, { Component, Fragment } from 'react';
import strings from '../../../../translations';
import ModalContainer from '../../shared/Modal/ModalContainer';
import ContractListView from './modal-feature-contracts-views/ContractListView';
import LinkContractView from './modal-feature-contracts-views/LinkContractView';

type Props = {
    /* ... */
};

type State = {
    activeView: string,
    title: string,
};

const initialState = {
    activeView: 'contractList',
    title: strings.modalFeatureContracts.titleListView,
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
    }

    handleGoBack = () => {
        this.modalSubmit = this.initialModalSubmit;
        this.setState({ ...initialState });
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
                    {activeView === 'contractList' && <ContractListView />}
                    {activeView === 'linkContract' && <LinkContractView />}
                </Fragment>
            </ModalContainer>
        );
    }
}

export default ModalFeatureContracts;
