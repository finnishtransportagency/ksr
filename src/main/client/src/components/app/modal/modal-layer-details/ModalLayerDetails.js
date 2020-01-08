// @flow
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { createAddressFields } from '../../../../utils/geoconvert/createAddressFields';
import strings from '../../../../translations';
import save from '../../../../utils/saveFeatureData';
import ModalContainer from '../../shared/Modal/ModalContainer';
import FeatureDetailsForm from '../../shared/feature-details-form/FeatureDetailsForm';
import { formatPropertyInfoToSaveFormat, propertyIdFormat, validatePropertyId } from '../../../../utils/property';
import { queryFeatures } from '../../../../api/search/searchQuery';
import { zoomToFeatures } from '../../../../utils/map';
import { fetchPropertyInfo } from '../../../../api/search/searchProperty';

type Props = {
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
    copiedFeature: ?Object,
    existingAttributes: Object,
    formOptions: Object,
};

const initialState = {
    copiedFeature: null,
    existingAttributes: {},
    formOptions: {
        editedFields: [],
        submitDisabled: true,
    },
};

class ModalFilter extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        const copiedFeature = props.layer.graphics.items.length
            ? props.layer.graphics.items[0]
            : null;

        const existingAttributes = copiedFeature && copiedFeature.attributes
            ? copiedFeature.attributes
            : {};

        this.state = {
            ...initialState,
            copiedFeature,
            existingAttributes,
        };
    }

    handlePropertySubmit = async (combinedData: Object) => {
        const {
            view,
            originalLayerId,
            objectId,
            activeLayer,
        } = this.props;

        if (validatePropertyId(combinedData.attributes[activeLayer.propertyIdField])) {
            const propertyId = propertyIdFormat(
                combinedData.attributes[activeLayer.propertyIdField],
            );
            // check if property id exist in the database.
            let foundObject = await queryFeatures(
                parseInt(originalLayerId, 10),
                `${activeLayer.propertyIdField} = '${propertyId}'`,
                null,
            );
            if (Array.isArray(foundObject.features) && foundObject.features.length > 0) {
                toast.error(strings.property.errorToast.propertyAlreadyExist);
            } else {
                const data = await fetchPropertyInfo(
                    combinedData.attributes[activeLayer.propertyIdField],
                    null,
                );
                const formatFeature = await formatPropertyInfoToSaveFormat(data);
                if (formatFeature[0] && formatFeature[0].geometry !== null) {
                    await save.saveData('add', view, originalLayerId, formatFeature, objectId.name, false, false);
                    // found newly added property so we can zoom to feature.
                    foundObject = await queryFeatures(
                        parseInt(originalLayerId, 10),
                        `${activeLayer.propertyIdField} = '${propertyId}'`,
                        null,
                    );
                    if (Array.isArray(foundObject.features) && foundObject.features.length > 0) {
                        await zoomToFeatures(view, foundObject.features);
                    }
                } else {
                    toast.error(strings.property.errorToast.geometryMissing);
                }
            }
        } else {
            toast.error(strings.property.errorToast.invalidFormat);
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
            activeLayer,
        } = this.props;

        const { copiedFeature, formOptions } = this.state;
        const combinedData = {
            attributes: formOptions.editedFields,
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
        } else if (activeLayer.propertyIdField) {
            await this.handlePropertySubmit(combinedData);
        } else {
            await save.saveData('add', view, originalLayerId, [feature], objectId.name, false, false);
        }

        const { setTempGraphicsLayer, sketchViewModel } = this.props;
        if (layer) {
            layer.graphics = undefined;
            setTempGraphicsLayer(layer);
        }
        sketchViewModel.cancel();

        setActiveFeatureMode('create');
    };

    setFormOptions = (
        formOptions: Object,
    ) => {
        if (formOptions.submitDisabled) {
            const { sketchViewModel } = this.props;
            if (typeof sketchViewModel.updateGraphics.items[0].geometry !== 'undefined') {
                if (JSON.stringify(sketchViewModel.updateGraphics.items[0].geometry)
                !== JSON.stringify(sketchViewModel.updateGraphics.items[0].initialGeometry)) {
                    formOptions.submitDisabled = false;
                }
            }
        }
        this.setState({
            formOptions: {
                editedFields: formOptions.editedFields,
                submitDisabled: formOptions.submitDisabled,
            },
        });
    };

    render() {
        const { activeLayer, editModeActive } = this.props;
        const { formOptions, existingAttributes } = this.state;

        const modalSubmit = [{
            text: editModeActive
                ? strings.modalLayerDetails.editSubmit
                : strings.modalLayerDetails.submit,
            handleSubmit: this.handleModalSubmit,
            disabled: formOptions.submitDisabled,
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
                <FeatureDetailsForm
                    layer={activeLayer}
                    setFormOptions={this.setFormOptions}
                    formType={Object.entries(existingAttributes).length ? 'edit' : 'add'}
                    existingAttributes={existingAttributes}
                />
            </ModalContainer>
        );
    }
}

export default ModalFilter;
