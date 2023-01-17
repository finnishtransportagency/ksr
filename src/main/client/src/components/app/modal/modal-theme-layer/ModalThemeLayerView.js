// @flow
import React from 'react';
import Select from 'react-select';
import strings from '../../../../translations';
import { TextInput } from '../../../ui/elements';
import { InputInfo, InputWithIcon } from '../../../ui/elements/TextInput';
import { ModalThemeLayerWrapper } from './styles';
import { RadioWrapper } from '../../side-bar/search/styles';
import Radiobutton from '../../../ui/blocks/Radiobutton';

type Props = {
    handleFieldChange: Function,
    handleClassificationChange: Function,
    handleInputChange: Function,
    selectedField: string,
    selectedClassification: string,
    numClasses: number,
    layerFields: Object[],
};

function ModalThemeLayerView({
    handleFieldChange,
    handleClassificationChange,
    handleInputChange,
    selectedField,
    selectedClassification,
    numClasses,
    layerFields,
}: Props) {
    return (
        <ModalThemeLayerWrapper>
            <label
                htmlFor="selectField"
                onClick={e => e.preventDefault()}
            >
                <span id="selectField">{strings.modalThemeLayer.column}</span>
                <Select
                    onBlurResetsInput={false}
                    onSelectResetsInput={false}
                    options={layerFields}
                    simpleValue
                    name="selectField"
                    placeholder=""
                    clearable={false}
                    searchable={false}
                    onChange={handleFieldChange}
                    value={selectedField}
                    required
                />
            </label>
            <span>{strings.modalThemeLayer.classificationType}</span>
            <RadioWrapper>
                <Radiobutton htmlFor="equal-interval">
                    {strings.modalThemeLayer.equalInterval}
                    <Radiobutton.Input
                        checked={selectedClassification === 'equal-interval'}
                        type="radio"
                        id="equal-interval"
                        value="equal-interval"
                        onChange={handleClassificationChange}
                    />
                    <Radiobutton.Checkmark />
                </Radiobutton>
                <Radiobutton htmlFor="natural-breaks">
                    {strings.modalThemeLayer.naturalBreaks}
                    <Radiobutton.Input
                        checked={selectedClassification === 'natural-breaks'}
                        type="radio"
                        id="natural-breaks"
                        value="natural-breaks"
                        onChange={handleClassificationChange}
                    />
                    <Radiobutton.Checkmark />
                </Radiobutton>
                <Radiobutton htmlFor="quantile">
                    {strings.modalThemeLayer.quantile}
                    <Radiobutton.Input
                        checked={selectedClassification === 'quantile'}
                        type="radio"
                        id="quantile"
                        value="quantile"
                        onChange={handleClassificationChange}
                    />
                    <Radiobutton.Checkmark />
                </Radiobutton>
                <Radiobutton htmlFor="standard-deviation">
                    {strings.modalThemeLayer.standardDeviation}
                    <Radiobutton.Input
                        checked={selectedClassification === 'standard-deviation'}
                        type="radio"
                        id="standard-deviation"
                        value="standard-deviation"
                        onChange={handleClassificationChange}
                    />
                    <Radiobutton.Checkmark />
                </Radiobutton>
            </RadioWrapper>
            <label htmlFor={strings.modalThemeLayer.numClasses}>
                <span>{strings.modalThemeLayer.numClasses}</span>
                <InputWithIcon>
                    <TextInput
                        backgroundDarker
                        type="number"
                        placeholder=""
                        name="minScale"
                        autoComplete="off"
                        onChange={handleInputChange}
                        value={numClasses}
                        min={1}
                        max={10}
                        required
                    />
                    <InputInfo
                        data-balloon={strings.modalThemeLayer.infoTooltip}
                        data-balloon-pos="left"
                        data-balloon-length="medium"
                    >
                        <i className="fas fa-question-circle" />
                    </InputInfo>
                </InputWithIcon>
            </label>
        </ModalThemeLayerWrapper>
    );
}

export default ModalThemeLayerView;
