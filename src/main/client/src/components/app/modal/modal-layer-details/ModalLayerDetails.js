// @flow
import React, { Component } from 'react';
import { createAddressFields } from '../../../../utils/geoconvert/createAddressFields';
import strings from '../../../../translations';
import save from '../../../../utils/saveFeatureData';
import ModalContainer from '../../shared/Modal/ModalContainer';
import FeatureDetailsForm from '../../shared/feature-details-form/FeatureDetailsForm';

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
        } else {
            await save.saveData('add', view, originalLayerId, [feature], objectId.name, undefined, false, false);
        }

        const { setTempGraphicsLayer, sketchViewModel } = this.props;
        if (layer) {
            layer.graphics = undefined;
            setTempGraphicsLayer(layer);
        }
        sketchViewModel.cancel();
        sketchViewModel.reset();

        setActiveFeatureMode('create');
    };

    setFormOptions = (formOptions: Object) => {
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
