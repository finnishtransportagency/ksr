// @flow
import React, { Component } from 'react';
import { queryFeatures } from '../../../../../api/search/searchQuery';
import LinkContractView from './LinkContractView';

type Props = {
    contractLinkValidation: (
        validContract?: boolean,
        contractNumber?: number,
        contractUpdateLayer?: Object,
        contractUuid?: string,
    ) => void,
    currentLayer: Object,
    contractLinkLayer: Object,
    contractLayer: Object,
};

type State = {
    contractNumber: number | string,
    fetching: boolean,
    contractExists: boolean,
};

const initialState = {
    contractNumber: '',
    fetching: false,
    contractExists: false,
};

class LinkContract extends Component<Props, State> {
    abortController: ?Object = null; // eslint-disable-line react/sort-comp
    existsQuery: ?number = 0; // eslint-disable-line react/sort-comp

    constructor(props: Props) {
        super(props);

        this.state = { ...initialState };

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange = (evt: Object) => {
        const contractNumber = evt.target.value;
        window.clearTimeout(this.existsQuery);
        if (this.abortController) this.abortController.abort();

        this.setState({
            contractNumber,
            fetching: true,
            contractExists: false,
        });

        this.props.contractLinkValidation(false);

        if (contractNumber) {
            this.existsQuery = window.setTimeout(async () => {
                const signal = this.abortController ? this.abortController.signal : undefined;

                const { contractLinkLayer, contractLayer, currentLayer } = this.props;

                const res = await queryFeatures(
                    contractLayer.id,
                    `${contractLayer.contractIdField} = '${contractNumber}'`,
                    signal,
                );

                if (res.features && res.features.length) {
                    const contractUuid = res.features[0].attributes.CONTRACT_UUID;
                    this.props.contractLinkValidation(
                        true,
                        contractNumber,
                        contractLinkLayer || currentLayer,
                        contractUuid,
                    );
                    this.setState({
                        fetching: false,
                        contractExists: true,
                    });
                } else {
                    this.setState({
                        fetching: false,
                    });
                }
            }, 300);
        } else {
            this.setState({
                contractNumber: '',
                fetching: false,
            });
        }
    };

    render() {
        const {
            contractNumber, fetching, contractExists,
        } = this.state;

        return (
            <LinkContractView
                handleInputChange={this.handleInputChange}
                contractNumber={contractNumber}
                fetching={fetching}
                contractExists={contractExists}
            />
        );
    }
}

export default LinkContract;
