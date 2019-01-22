// @flow
import React, { Component } from 'react';
import { createAddressFields } from '../../../../utils/geoconvert/createAddressFields';
import ModalLayerDetailsView from './ModalLayerDetailsView';
import strings from '../../../../translations';
import save from '../../../../utils/saveFeatureData';
import ModalContainer from '../../shared/Modal/ModalContainer';
import { queryFeatures } from '../../../../api/search/searchQuery';
import { nestedVal } from '../../../../utils/nestedValue';

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
    objectId: Object,
    addUpdateLayers: Function,
    editModeActive: boolean,
    setActiveFeatureMode: (string) => void,
};

type State = {
    dataFields: Array<Object>,
    fetching: boolean,
    contractExists: boolean,
    data: Object,
    copiedFeature: ?Object,
};

const initialState = {
    dataFields: [],
    data: {},
    fetching: false,
    contractExists: true,
    copiedFeature: {},
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
        const copiedFeature = layer.graphics.items.length ?
            layer.graphics.items[0] : null;
        const copiedAttributes = copiedFeature ?
            copiedFeature.attributes : null;

        const dataFields = fields.map(field => ({
            ...field,
            nullable: field.name !== activeLayer.contractIdField,
            data: copiedAttributes && copiedAttributes[field.name] ?
                copiedAttributes[field.name] : '',
        })).filter(f => (f.type !== 'esriFieldTypeOID'
                && f.editable
                && f.name !== activeLayer.relationColumnOut)
                || (f.name === activeLayer.contractIdField
                    && f.name === activeLayer.relationColumnOut));

        const dataObject = Object.assign({}, ...(dataFields.map(item =>
            ({ [item.name]: item.data }))));

        this.setState({ dataFields, data: dataObject, copiedFeature });
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

    handleModalSubmit = async () => {
        const {
            addressField,
            view,
            originalLayerId,
            featureType,
            layer,
            objectId,
            addUpdateLayers,
            activeLayer,
            editModeActive,
            setActiveFeatureMode,
        } = this.props;

        const { data, copiedFeature } = this.state;
        const combinedData = {
            attributes: data,
            geometry: copiedFeature ? copiedFeature.geometry : null,
        };
        const feature = await createAddressFields(combinedData, featureType, addressField);
        let featureId = '';
        if (editModeActive && copiedFeature) {
            // Filter unchanged attributes.
            feature.attributes = Object.entries(feature.attributes).reduce((acc, cur) => {
                if (cur[1] !== copiedFeature.attributes[cur[0]]
                    && !(!cur[1] && !copiedFeature.attributes[cur[0]])) {
                    return { ...acc, [cur[0]]: cur[1] };
                }
                return { ...acc };
            }, {});

            if (feature.geometry === copiedFeature.initialGeometry) delete feature.geometry;

            // Add object id field and value for the feature.
            featureId = copiedFeature.attributes[objectId.name];
            feature.attributes[objectId.name] = featureId;
            await save.saveData('update', view, originalLayerId, [feature]);
        } else {
            const response = await save.saveData('add', view, originalLayerId, [feature]);
            if (response && response.addResults && response.addResults.length > 0) {
                featureId = response.addResults[0].objectId;
            }
        }
        if (objectId && featureId) {
            if (layer) {
                layer.graphics = undefined;
                this.props.setTempGraphicsLayer(layer);
            }
            this.props.sketchViewModel.cancel();
            this.props.sketchViewModel.reset();

            if (nestedVal(activeLayer, ['type']) === 'agfl' || editModeActive) {
                addUpdateLayers(
                    originalLayerId,
                    objectId.name,
                    featureId,
                    editModeActive,
                );
            }
            setActiveFeatureMode('create');
        }
    };

    render() {
        const { activeLayer, editModeActive } = this.props;
        const { fetching, contractExists, dataFields } = this.state;
        const validContract = activeLayer.type === 'agfl'
            ? activeLayer.contractIdField && !contractExists
            : activeLayer.contractIdField && contractExists;
        const disabled = (activeLayer.contractIdField)
            && (!validContract
            || fetching
            || !nestedVal(
                dataFields.find(a => a.name === activeLayer.contractIdField),
                ['data', 'length'],
            ));
        const modalSubmit = [{
            text: editModeActive
                ? strings.modalLayerDetails.editSubmit
                : strings.modalLayerDetails.submit,
            handleSubmit: this.handleModalSubmit,
            disabled,
            toggleModal: true,
        }];
        const modalTitle = editModeActive
            ? strings.modalLayerDetails.editTitle
            : strings.modalLayerDetails.title;

        return (
            <ModalContainer
                title={modalTitle}
                modalSubmit={modalSubmit}
                cancelText={strings.modalLayerDetails.cancel}
            >
                <ModalLayerDetailsView
                    fields={dataFields}
                    handleOnChange={this.handleOnChange}
                    fetching={fetching}
                    validContract={validContract}
                />
            </ModalContainer>
        );
    }
}

export default ModalFilter;
