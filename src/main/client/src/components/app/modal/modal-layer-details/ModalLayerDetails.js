// @flow
import React, { Component } from 'react';
import { createAddressFields } from '../../../../utils/geoconvert/createAddressFields';
import ModalLayerDetailsView from './ModalLayerDetailsView';
import strings from '../../../../translations';
import save from '../../../../utils/saveFeatureData';
import ModalContainer from '../../shared/Modal/ModalContainer';
import { queryFeatures } from '../../../../api/search/searchQuery';

type Props = {
    fields: any,
    layer: Object,
    setTempGraphicsLayer: Function,
    originalLayerId: string,
    view: Object,
    addressField: string,
    featureType: string,
    activeLayer: Object,
    sketchViewModel: Object,
};

type State = {
    dataFields: Array<Object>,
    fetching: boolean,
    contractExists: boolean,
    data: Object,
};

const initialState = {
    dataFields: [],
    data: {},
    fetching: false,
    contractExists: true,
};

class ModalFilter extends Component<Props, State> {
    abortController: ?Object = null; // eslint-disable-line react/sort-comp
    existsQuery: ?number = 0; // eslint-disable-line react/sort-comp

    constructor(props: Props) {
        super(props);
        this.state = { ...initialState };
    }

    componentDidMount() {
        this.loadFields();
    }

    loadFields = () => {
        const { fields, activeLayer, layer } = this.props;
        const copiedAttributes = layer.graphics.items.length ?
            layer.graphics.items[0].attributes : null;

        const dataFields = fields.map(field => ({
            ...field,
            nullable: field.name !== activeLayer.contractIdField,
            data: copiedAttributes && copiedAttributes[field.name] ?
                copiedAttributes[field.name] : '',
        }));

        const dataObject = Object.assign({}, ...(dataFields.map(item =>
            ({ [item.name]: item.data }))));

        this.setState({ dataFields, data: dataObject });
    };

    handleOnChange = (evt: Object, field: Object) => {
        const { name, value } = evt.target;
        const { dataFields } = this.state;

        this.setState({
            fetching: true,
        });

        const newData = dataFields.map(f => ({
            ...f,
            data: f.name === name ? value : f.data,
        }));

        this.setState({ dataFields: newData });

        window.clearTimeout(this.existsQuery);
        if (this.abortController) this.abortController.abort();

        const dataObject = Object.assign({}, ...(newData.map(item =>
            ({ [item.name]: item.data }))));
        this.setState({ data: dataObject });

        const { activeLayer } = this.props;

        if (value && field.name === activeLayer.contractIdField) {
            this.setState({ fetching: true, contractExists: true });

            this.existsQuery = window.setTimeout(() => {
                const signal = this.abortController ? this.abortController.signal : undefined;
                queryFeatures(
                    activeLayer.id,
                    `${activeLayer.contractIdField} = '${value}'`,
                    signal,
                ).then((r) => {
                    if (r.features && r.features.length < 1) {
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
                });
            }, 300);
        } else {
            this.setState({
                fetching: false,
            });
        }
    };

    handleModalSubmit = () => {
        const {
            addressField,
            view,
            originalLayerId,
            featureType,
            layer,
        } = this.props;

        const { data } = this.state;
        const combinedData = {
            attributes: data,
            geometry: layer.graphics.items.length ? layer.graphics.items[0].geometry : null,
        };

        createAddressFields(combinedData, featureType, addressField)
            .then(r => save.saveData('add', view, originalLayerId, [r]))
            .then(() => {
                if (layer) {
                    layer.graphics = undefined;
                    this.props.setTempGraphicsLayer(layer);
                }
                this.props.sketchViewModel.cancel();
                this.props.sketchViewModel.reset();
            });
    };

    render() {
        const { activeLayer } = this.props;
        const { fetching, contractExists, dataFields } = this.state;
        const disabled = activeLayer.contractIdField && contractExists;
        const modalSubmit = [{
            text: strings.modalLayerDetails.submit,
            handleSubmit: this.handleModalSubmit,
            disabled,
            toggleModal: true,
        }];

        return (
            <ModalContainer
                title={strings.modalLayerDetails.title}
                modalSubmit={modalSubmit}
                cancelText={strings.modalLayerDetails.cancel}
            >
                <ModalLayerDetailsView
                    fields={dataFields}
                    handleOnChange={this.handleOnChange}
                    fetching={fetching}
                    contractExists={contractExists}
                />
            </ModalContainer>
        );
    }
}

export default ModalFilter;
