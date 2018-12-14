// @flow
import React, { Component } from 'react';
import { queryFeatures } from '../../../../../api/search/searchQuery';
import ModalLayerDetailsView from '../../modal-layer-details/ModalLayerDetailsView';

type Props = {
    contractLinkValidation: (
        validContract?: boolean,
        contractNumber?: number,
        contractUpdateLayer?: Object,
        contractUuid?: string,
    ) => void,
    currentLayer: Object,
    contractLayer: Object,
    fields: Array<Object>,
    setData: Function,
};

type State = {
    contractData: Array<Object>,
    fetching: boolean,
    contractExists: boolean,
};

const initialState = {
    contractData: [],
    fetching: false,
    contractExists: true,
};

class AddContract extends Component<Props, State> {
    abortController: ?Object = null; // eslint-disable-line react/sort-comp
    existsQuery: ?number = 0; // eslint-disable-line react/sort-comp

    constructor(props: Props) {
        super(props);

        this.state = { ...initialState };

        this.handleOnChange = this.handleOnChange.bind(this);
    }

    componentDidMount() {
        this.loadFields();
    }

    loadFields = () => {
        const { fields, contractLayer, currentLayer } = this.props;

        const data = fields.filter(f => (f.type !== 'esriFieldTypeOID' &&
            f.editable && f.name !== contractLayer.relationColumnOut) ||
            (f.name === contractLayer.contractIdField &&
            f.name === contractLayer.relationColumnOut)).map((field) => {
            const newItem = Object.assign({}, field);
            if (field.name === currentLayer.contractIdField) {
                newItem.nullable = false;
            }
            newItem.data = '';
            return newItem;
        });
        this.setState({ contractData: data });
    };

    handleOnChange = (evt: Object, field: Object) => {
        const { name, value } = evt.target;
        const { contractData } = this.state;
        const { currentLayer, contractLayer, setData } = this.props;

        this.setState({
            fetching: true,
        });

        const newData = contractData.map(f => ({
            ...f,
            data: f.name === name ? value : f.data,
        }));
        this.setState({ contractData: newData });

        window.clearTimeout(this.existsQuery);
        if (this.abortController) this.abortController.abort();

        const dataObject = Object.assign({}, ...(newData.map(item =>
            ({ [item.name]: item.data }))));

        setData(dataObject);

        if (value && field.name === contractLayer.contractIdField) {
            this.props.contractLinkValidation(false);

            this.existsQuery = window.setTimeout(async () => {
                const signal = this.abortController ? this.abortController.signal : undefined;

                const res = await queryFeatures(
                    contractLayer.id,
                    `${contractLayer.contractIdField} = '${value}'`,
                    signal,
                );

                if (res.features && res.features.length < 1) {
                    this.props.contractLinkValidation(
                        true,
                        value,
                        currentLayer,
                        '',
                    );
                    this.setState({
                        fetching: false,
                        contractExists: false,
                    });
                } else {
                    this.setState({
                        fetching: false,
                        contractExists: true,
                    });
                }
            }, 300);
        } else {
            this.setState({
                fetching: false,
            });
        }
    };

    render() {
        const { contractData, fetching, contractExists } = this.state;

        return (
            <ModalLayerDetailsView
                fields={contractData}
                handleOnChange={this.handleOnChange}
                fetching={fetching}
                contractExists={contractExists}
            />
        );
    }
}

export default AddContract;
