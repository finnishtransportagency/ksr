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

    componentWillUnmount() {
        const { layer } = this.props;
        if (layer) {
            layer.graphics = undefined;
            this.props.setTempGraphicsLayer(layer);
        }
    }

    loadFields = () => {
        const {
            fields, activeLayer,
        } = this.props;

        const dataFields = fields.map(field => ({
            ...field,
            nullable: field.name !== activeLayer.contractIdField,
            data: '',
        }));

        this.setState({ dataFields });
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

        const dataObject = Object.assign({}, ...(newData.map(item =>
            ({ [item.name]: item.data }))));
        this.setState({ data: dataObject });

        const { activeLayer } = this.props;

        if (value && field.name === activeLayer.contractIdField) {
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
            .then(r => save.saveData('add', view, originalLayerId, [r]));
    };

    render() {
        const { fetching, contractExists, dataFields } = this.state;

        const modalSubmit = [{
            text: strings.modalLayerDetails.submit,
            handleSubmit: this.handleModalSubmit,
            disabled: contractExists,
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
