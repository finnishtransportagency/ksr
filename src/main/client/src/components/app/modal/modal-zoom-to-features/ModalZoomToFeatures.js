// @flow
import React, { useEffect, useState } from 'react';
import strings from '../../../../translations';
import ModalContainer from '../../shared/Modal/ModalContainer';
import ModalZoomToFeaturesView from './ModalZoomToFeaturesView';
import { zoomToFeatures } from '../../../../utils/map';

type Props = {
    tableGeometryData: Object[],
    selectedGeometryData: Object[],
    view: Object,
    activeLayerId: string,
};

type State = {
    currentTableOnly: boolean,
    selectedFeaturesOnly: boolean,
    featuresToZoomTo: Object[],
};

const initialState: State = {
    currentTableOnly: false,
    selectedFeaturesOnly: false,
    featuresToZoomTo: [],
};

const ModalZoomToFeatures = ({
    tableGeometryData,
    selectedGeometryData,
    view,
    activeLayerId,
}: Props) => {
    const [currentTableOnly, setCurrentTableOnly] = useState(initialState.currentTableOnly);
    const [
        selectedFeaturesOnly,
        setSelectedFeaturesOnly,
    ] = useState(initialState.selectedFeaturesOnly);
    const [featuresToZoomTo, setFeaturesToZoomTo] = useState(initialState.featuresToZoomTo);

    const modalSubmit = [{
        text: strings.modalZoomToFeatures.modalSubmit,
        handleSubmit: async () => {
            await zoomToFeatures(view, featuresToZoomTo);
        },
        disabled: false,
        toggleModal: true,
    }];

    useEffect(() => {
        const featureData = selectedFeaturesOnly
            ? selectedGeometryData
            : tableGeometryData;

        const selectedFeatures = currentTableOnly
            ? featureData.filter(a => a.layerId === activeLayerId)
            : featureData;

        setFeaturesToZoomTo(selectedFeatures);
    }, [currentTableOnly, selectedFeaturesOnly]);

    return (
        <ModalContainer
            title={strings.modalZoomToFeatures.modalTitle}
            modalSubmit={modalSubmit}
            cancelText={strings.modalZoomToFeatures.modalCancel}
        >
            <ModalZoomToFeaturesView
                currentTableOnly={currentTableOnly}
                selectedFeaturesOnly={selectedFeaturesOnly}
                setCurrentTableOnly={setCurrentTableOnly}
                setSelectedFeaturesOnly={setSelectedFeaturesOnly}
            />
        </ModalContainer>
    );
};

export default ModalZoomToFeatures;
