// @flow
import React, { Component } from 'react';
import { createAddressFields } from '../../../../utils/geoconvert/createAddressFields';
import ModalLayerDetailsView from './ModalLayerDetailsView';
import strings from '../../../../translations';
import save from '../../../../utils/saveFeatureData';
import ModalContainer from '../../shared/Modal/ModalContainer';
import { queryFeatures } from '../../../../api/search/searchQuery';
import { nestedVal } from '../../../../utils/nestedValue';
import { toUnixTime } from '../../../../utils/date';

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
    editModeActive: boolean,
    setActiveFeatureMode: (string) => void,
};

type State = {
    dataFields: Array<Object>,
    fetching: boolean,
    contractExists: boolean,
    copiedFeature: ?Object,
};

const initialState = {
    dataFields: [],
    fetching: false,
    contractExists: true,
    copiedFeature: {},
};

class ModalFilter extends Component<Props, State> {
    abortController: ?Object = null;

    existsQuery: ?number = 0;

    constructor(props: Props) {
        super(props);
        this.state = { ...initialState };
    }

    componentDidMount() {
        this.loadFields();
    }

    loadFields = () => {
        const { fields, activeLayer, layer } = this.props;
        const copiedFeature = layer.graphics.items.length
            ? layer.graphics.items[0] : null;
        const copiedAttributes = copiedFeature
            ? copiedFeature.attributes : null;

        const dataFields = fields.map(field => ({
            ...field,
            nullable: field.name !== activeLayer.relationColumnOut,
            data: copiedAttributes && copiedAttributes[field.name]
                ? String(copiedAttributes[field.name]) : '',
        })).filter(f => (f.type !== 'esriFieldTypeOID'
                && f.editable
                && f.name !== 'CONTRACT_UUID'
                && f.name !== activeLayer.relationColumnOut)
                || (f.name === activeLayer.relationColumnOut
                    && f.name === activeLayer.relationColumnOut));

        this.setState({ dataFields, copiedFeature });
    };

    handleOnChange = (evt: Object, field: Object) => {
        const { name, value } = evt.target;
        const { dataFields } = this.state;
        const { activeLayer } = this.props;

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

        if (value && field.name === activeLayer.relationColumnOut) {
            this.setState({ fetching: true, contractExists: true });

            this.existsQuery = window.setTimeout(() => {
                const signal = this.abortController ? this.abortController.signal : undefined;
                queryFeatures(
                    activeLayer.id,
                    `${activeLayer.relationColumnOut} = '${value}'`,
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
            editModeActive,
            setActiveFeatureMode,
            sketchViewModel,
            setTempGraphicsLayer,
        } = this.props;

        const { dataFields, copiedFeature } = this.state;


        const data = dataFields.reduce((acc, cur) => {
            const isDate = cur.type === 'esriFieldTypeDate';
            return { ...acc, [cur.name]: isDate ? toUnixTime(cur.data) : cur.data };
        }, {});

        const combinedData = {
            attributes: data,
            geometry: copiedFeature ? copiedFeature.geometry : null,
        };
        const feature = await createAddressFields(combinedData, featureType, addressField);
        let featureId = 0;
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
            await save.saveData('update', view, originalLayerId, [feature], objectId.name, featureId);
        } else {
            await save.saveData('add', view, originalLayerId, [feature], objectId.name, undefined, false, false);
        }
        if (layer) {
            layer.graphics = undefined;
            setTempGraphicsLayer(layer);
        }
        sketchViewModel.cancel();
        sketchViewModel.reset();

        setActiveFeatureMode('create');
    };

    render() {
        const { activeLayer, editModeActive } = this.props;
        const { fetching, contractExists, dataFields } = this.state;
        const validContract = activeLayer.type === 'agfl'
            ? activeLayer.relationColumnOut && !contractExists
            : activeLayer.relationColumnOut && contractExists;
        const disabled = (activeLayer.relationColumnOut)
            && (!validContract
            || fetching
            || !nestedVal(
                dataFields.find(a => a.name === activeLayer.relationColumnOut),
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
