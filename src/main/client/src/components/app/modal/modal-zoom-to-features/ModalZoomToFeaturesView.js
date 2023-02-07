// @flow
import React, { Fragment } from 'react';
import strings from '../../../../translations';
import Checkbox from '../../../ui/blocks/Checkbox';
import { CheckboxWrapper } from './styles';

type Props = {
    currentTableOnly: boolean,
    selectedFeaturesOnly: boolean,
    setCurrentTableOnly: Function,
    setSelectedFeaturesOnly: Function,
};

function ModalZoomToFeaturesView({
    currentTableOnly,
    selectedFeaturesOnly,
    setCurrentTableOnly,
    setSelectedFeaturesOnly,
}: Props): React$Element<React$FragmentType> {
    return (
        <>
            <p>{strings.modalZoomToFeatures.content.description}</p>
            <CheckboxWrapper>
                <Checkbox className="content-checkbox" htmlFor="currentTableOnly">
                    <p title={strings.modalZoomToFeatures.content.checkTable}>
                        {strings.modalZoomToFeatures.content.checkTable}
                    </p>
                    <Checkbox.Input
                        id="currentTableOnly"
                        name="currentTableOnly"
                        type="checkbox"
                        checked={currentTableOnly}
                        onChange={() => setCurrentTableOnly(!currentTableOnly)}
                    />
                    <Checkbox.Checkmark />
                </Checkbox>
                <Checkbox className="content-checkbox" htmlFor="selectedFeaturesOnly">
                    <p title={strings.modalZoomToFeatures.content.checkFeature}>
                        {strings.modalZoomToFeatures.content.checkFeature}
                    </p>
                    <Checkbox.Input
                        id="selectedFeaturesOnly"
                        name="selectedFeaturesOnly"
                        type="checkbox"
                        checked={selectedFeaturesOnly}
                        onChange={() => setSelectedFeaturesOnly(!selectedFeaturesOnly)}
                    />
                    <Checkbox.Checkmark />
                </Checkbox>
            </CheckboxWrapper>
        </>
    );
}

export default ModalZoomToFeaturesView;
