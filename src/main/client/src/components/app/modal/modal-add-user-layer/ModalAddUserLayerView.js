// @flow
import Slider from 'rc-slider';
import React, { Fragment } from 'react';
import strings from '../../../../translations';
import Checkbox from '../../../ui/blocks/Checkbox';
import { TextInput } from '../../../ui/elements';
import { CheckboxWrapper } from '../modal-filter/styles';
import { InputWithIcon, InputInfo } from '../../../ui/elements/TextInput';
import { RadioWrapper, SliderWrapper, Wrapper } from './styles';
import Radiobutton from '../../../ui/blocks/Radiobutton';

type Props = {
    handleInputChange: Function,
    handleTypeChange: Function,
    handleCheckboxChange: Function,
    handleOpacityChange: Function,
    layerValues: Object,
    optionsType: Array<Object>,
};

function ModalAddUserLayerView({
    handleInputChange,
    handleTypeChange,
    handleCheckboxChange,
    handleOpacityChange,
    layerValues,
    optionsType,
}: Props): React$Element<React$FragmentType> {
    return (
        <>
            <label htmlFor={strings.modalAddUserLayer.name}>
                <span>{strings.modalAddUserLayer.name}</span>
                <InputWithIcon>
                    <TextInput
                        required
                        backgroundDarker
                        type="text"
                        placeholder=""
                        name="name"
                        autoComplete="off"
                        onChange={handleInputChange}
                        value={layerValues.name}
                    />
                    <InputInfo
                        data-balloon={strings.modalAddUserLayer.infoTooltip.name}
                        data-balloon-pos="left"
                    >
                        <i className="fas fa-question-circle" />
                    </InputInfo>
                </InputWithIcon>
            </label>
            <label htmlFor={strings.modalAddUserLayer.url}>
                <span>{strings.modalAddUserLayer.url}</span>
                <InputWithIcon>
                    <TextInput
                        required
                        backgroundDarker
                        type="text"
                        placeholder=""
                        name="url"
                        autoComplete="off"
                        onChange={handleInputChange}
                        value={layerValues.url}
                    />
                    <InputInfo
                        data-balloon={strings.modalAddUserLayer.infoTooltip.url}
                        data-balloon-pos="left"
                    >
                        <i className="fas fa-question-circle" />
                    </InputInfo>
                </InputWithIcon>
            </label>
            <label htmlFor={strings.modalAddUserLayer.type}>
                <Wrapper>
                    <span>{strings.modalAddUserLayer.type}</span>
                    <InputInfo
                        select
                        data-balloon={strings.modalAddUserLayer.infoTooltip.type}
                        data-balloon-pos="left"
                        data-balloon-length="medium"
                    >
                        <i className="fas fa-question-circle" />
                    </InputInfo>
                </Wrapper>
                <RadioWrapper>
                    {
                        optionsType.map(t => (
                            <Radiobutton htmlFor={t.value} key={t.value}>
                                {t.label}
                                <Radiobutton.Input
                                    checked={layerValues.type === t.value}
                                    type="radio"
                                    id={t.value}
                                    value={layerValues.type}
                                    onChange={() => handleTypeChange(t.value)}
                                />
                                <Radiobutton.Checkmark />
                            </Radiobutton>
                        ))
                    }
                </RadioWrapper>
            </label>
            { layerValues.type !== 'agfs'
        && (
            <label htmlFor={strings.modalAddUserLayer.layers}>
                <span>{strings.modalAddUserLayer.layers}</span>
                <InputWithIcon>
                    <TextInput
                        required
                        backgroundDarker
                        type="text"
                        placeholder=""
                        name="layers"
                        autoComplete="off"
                        onChange={handleInputChange}
                        value={layerValues.layers}
                    />
                    <InputInfo
                        data-balloon={strings.modalAddUserLayer.infoTooltip.layers}
                        data-balloon-pos="left"
                        data-balloon-length="medium"
                    >
                        <i className="fas fa-question-circle" />
                    </InputInfo>
                </InputWithIcon>
            </label>
        )}
            { layerValues.type === 'agfs'
        && (
            <label htmlFor={strings.modalAddUserLayer.queryColumns}>
                <span>{strings.modalAddUserLayer.queryColumns}</span>
                <InputWithIcon>
                    <TextInput
                        backgroundDarker
                        type="text"
                        placeholder=""
                        name="queryColumns"
                        autoComplete="off"
                        onChange={handleInputChange}
                        value={layerValues.queryColumns}
                    />
                    <InputInfo
                        data-balloon={strings.modalAddUserLayer.infoTooltip.queryColumns}
                        data-balloon-pos="left"
                    >
                        <i className="fas fa-question-circle" />
                    </InputInfo>
                </InputWithIcon>
            </label>
        )}
            <label htmlFor={strings.modalAddUserLayer.styles}>
                <span>{strings.modalAddUserLayer.styles}</span>
                <InputWithIcon>
                    <TextInput
                        backgroundDarker
                        type="text"
                        placeholder=""
                        name="styles"
                        autoComplete="off"
                        onChange={handleInputChange}
                        value={layerValues.styles}
                    />
                    <InputInfo
                        data-balloon={strings.modalAddUserLayer.infoTooltip.styles}
                        data-balloon-pos="left"
                    >
                        <i className="fas fa-question-circle" />
                    </InputInfo>
                </InputWithIcon>
            </label>
            <label htmlFor={strings.modalAddUserLayer.minScale}>
                <span>{strings.modalAddUserLayer.minScale}</span>
                <InputWithIcon>
                    <TextInput
                        backgroundDarker
                        type="number"
                        placeholder=""
                        name="minScale"
                        autoComplete="off"
                        onChange={handleInputChange}
                        value={layerValues.minScale}
                    />
                    <InputInfo
                        data-balloon={strings.modalAddUserLayer.infoTooltip.minScale}
                        data-balloon-pos="left"
                        data-balloon-length="medium"
                    >
                        <i className="fas fa-question-circle" />
                    </InputInfo>
                </InputWithIcon>
            </label>
            <label htmlFor={strings.modalAddUserLayer.maxScale}>
                <span>{strings.modalAddUserLayer.maxScale}</span>
                <InputWithIcon>
                    <TextInput
                        backgroundDarker
                        type="number"
                        placeholder=""
                        name="maxScale"
                        autoComplete="off"
                        onChange={handleInputChange}
                        value={layerValues.maxScale}
                    />
                    <InputInfo
                        data-balloon={strings.modalAddUserLayer.infoTooltip.maxScale}
                        data-balloon-pos="left"
                        data-balloon-length="medium"
                    >
                        <i className="fas fa-question-circle" />
                    </InputInfo>
                </InputWithIcon>
            </label>
            <label htmlFor={strings.modalAddUserLayer.attribution}>
                <span>{strings.modalAddUserLayer.attribution}</span>
                <InputWithIcon>
                    <TextInput
                        backgroundDarker
                        type="text"
                        placeholder=""
                        name="attribution"
                        autoComplete="off"
                        onChange={handleInputChange}
                        value={layerValues.attribution}
                    />
                    <InputInfo
                        data-balloon={strings.modalAddUserLayer.infoTooltip.attribution}
                        data-balloon-pos="left"
                    >
                        <i className="fas fa-question-circle" />
                    </InputInfo>
                </InputWithIcon>
            </label>
            <SliderWrapper>
                <span>{strings.modalAddUserLayer.opacity}</span>
                <Slider
                    min={0}
                    max={1}
                    step={0.1}
                    defaultValue={
                        layerValues.opacity
                    }
                    onChange={evt => handleOpacityChange(evt)}
                />
            </SliderWrapper>
            <CheckboxWrapper>
                <Checkbox className="content-checkbox" htmlFor="transparent">
                    <p title={strings.modalAddUserLayer.transparent}>
                        {strings.modalAddUserLayer.transparent}
                    </p>
                    <Checkbox.Input
                        id="transparent"
                        name="transparent"
                        type="checkbox"
                        checked={layerValues.transparent}
                        onChange={() => handleCheckboxChange('transparent')}
                    />
                    <Checkbox.Checkmark />
                </Checkbox>
            </CheckboxWrapper>
            <CheckboxWrapper>
                <Checkbox className="content-checkbox" htmlFor="desktopVisible">
                    <p title={strings.modalAddUserLayer.desktopVisible}>
                        {strings.modalAddUserLayer.desktopVisible}
                    </p>
                    <Checkbox.Input
                        id="desktopVisible"
                        name="desktopVisible"
                        type="checkbox"
                        checked={layerValues.desktopVisible}
                        onChange={() => handleCheckboxChange('desktopVisible')}
                    />
                    <Checkbox.Checkmark />
                </Checkbox>
            </CheckboxWrapper>
            <CheckboxWrapper>
                <Checkbox className="content-checkbox" htmlFor="mobileVisible">
                    <p title={strings.modalAddUserLayer.mobileVisible}>
                        {strings.modalAddUserLayer.mobileVisible}
                    </p>
                    <Checkbox.Input
                        id="mobileVisible"
                        name="mobileVisible"
                        type="checkbox"
                        checked={layerValues.mobileVisible}
                        onChange={() => handleCheckboxChange('mobileVisible')}
                    />
                    <Checkbox.Checkmark />
                </Checkbox>
            </CheckboxWrapper>
        </>
    );
}

export default ModalAddUserLayerView;
