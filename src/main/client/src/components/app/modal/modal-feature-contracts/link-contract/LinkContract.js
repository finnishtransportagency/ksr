// @flow
import React, { Component } from 'react';
import { queryFeatures } from '../../../../../api/search/searchQuery';
import LinkContractView from './LinkContractView';

type Props = {
    contractLinkValidation: (
        validContract?: boolean,
        contractNumber?: string,
        contractUuid?: string,
    ) => void,
    contractLayer: Object,
};

type State = {
    contractNumber: string,
    fetching: boolean,
    contractExists: boolean,
};

const initialState = {
    contractNumber: '',
    fetching: false,
    contractExists: false,
};

class LinkContract extends Component<Props, State> {
    abortController: ?Object = null;

    // eslint-disable-line react/sort-comp
    existsQuery: ?number = 0;

    // eslint-disable-line react/sort-comp
    _isMounted: boolean = true;

    constructor(props: Props) {
        super(props);

        this.state = { ...initialState };

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    handleInputChange: any = (evt: Object) => {
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

                const { contractLayer } = this.props;

                const res = await queryFeatures(
                    contractLayer.id,
                    `${contractLayer.contractIdField} = '${contractNumber}'`,
                    signal,
                );

                // Don't do anything if value doesn't match the one in state
                if (this._isMounted && contractNumber === this.state.contractNumber) {
                    if (res.features && res.features.length) {
                        const contractUuid = res.features[0].attributes.CONTRACT_UUID;
                        this.props.contractLinkValidation(
                            true,
                            contractNumber,
                            contractUuid,
                        );
                        this.setState({
                            fetching: false,
                            contractExists: true,
                        });
                    } else {
                        this.setState({
                            fetching: false,
                            contractExists: false,
                        });

                        this.props.contractLinkValidation(false);
                    }
                }
            }, 300);
        } else {
            this.setState({
                contractNumber: '',
                fetching: false,
            });
        }
    };

    render(): any {
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
