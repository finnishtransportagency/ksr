// @flow
import React, { Fragment } from 'react';
import { TextInput } from '../../../ui/elements';
import strings from '../../../../translations';
import Checkbox from '../../../ui/blocks/Checkbox';
import { CheckboxWrapper, DescriptionWrapper } from './styles';

type Props = {
    currentTableOnly: boolean,
    selectedFeaturesOnly: boolean,
    handleBufferChange: Function,
    handleTableSelectionChange: Function,
    handleFeatureSelectionChange: Function,
};

const ModalBufferSelectedView = ({
    currentTableOnly,
    selectedFeaturesOnly,
    handleBufferChange,
    handleTableSelectionChange,
    handleFeatureSelectionChange,
}: Props) => (
    <Fragment>
        <DescriptionWrapper>
            <p>{strings.modalBufferSelectedData.description}</p>
        </DescriptionWrapper>
        <label
            htmlFor="bufferSelectedView"
        >
            {strings.modalBufferSelectedData.bufferLabel}
            <TextInput
                backgroundDarker
                index="bufferSelectedView"
                type="number"
                min={0}
                max={100000}
                onChange={handleBufferChange}
            />
        </label>
        <CheckboxWrapper>
            <Checkbox className="content-checkbox" htmlFor="currentTableOnly">
                <p title={strings.modalBufferSelectedData.checkTable}>
                    {strings.modalBufferSelectedData.checkTable}
                </p>
                <Checkbox.Input
                    id="currentTableOnly"
                    name="currentTableOnly"
                    type="checkbox"
                    checked={currentTableOnly}
                    onChange={() => handleTableSelectionChange()}
                />
                <Checkbox.Checkmark />
            </Checkbox>
            <Checkbox className="content-checkbox" htmlFor="selectedFeaturesOnly">
                <p title={strings.modalBufferSelectedData.checkFeature}>
                    {strings.modalBufferSelectedData.checkFeature}
                </p>
                <Checkbox.Input
                    id="selectedFeaturesOnly"
                    name="selectedFeaturesOnly"
                    type="checkbox"
                    checked={selectedFeaturesOnly}
                    onChange={() => handleFeatureSelectionChange()}
                />
                <Checkbox.Checkmark />
            </Checkbox>
        </CheckboxWrapper>
    </Fragment>
);

export default ModalBufferSelectedView;
