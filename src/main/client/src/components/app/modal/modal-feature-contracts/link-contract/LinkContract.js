// @flow
import React, { Component } from 'react';
import { queryFeatures } from '../../../../../api/search/searchQuery';
import { getRelationLayers } from '../../../../../utils/contracts/contracts';
import LinkContractView from './LinkContractView';

type Props = {
    contractLinkValidation: (
        validContract?: boolean,
        contractNumber?: number,
        contractUpdateLayer?: Object,
        contractUuid?: string,
    ) => void,
    currentLayer: Object,
    relationLayer: Object,
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
            this.existsQuery = window.setTimeout(() => {
                const signal = this.abortController ? this.abortController.signal : undefined;

                const { currentLayer, relationLayer } = this.props;

                const {
                    layerToQuery,
                    layerToUpdate,
                } = getRelationLayers(currentLayer, relationLayer);

                queryFeatures(
                    layerToQuery,
                    `${currentLayer.contractIdField} = '${contractNumber}'`,
                    signal,
                ).then((r) => {
                    if (r.features && r.features.length) {
                        const contractUuid = r.features[0].attributes.CONTRACT_UUID;
                        this.props.contractLinkValidation(
                            true,
                            contractNumber,
                            layerToUpdate,
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
                });
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
