// @flow
import React from 'react';
import 'react-select/dist/react-select.css';
import strings from '../../../../translations';
import Radiobutton from '../../../ui/blocks/Radiobutton';
import { H1 } from '../../../ui/elements';
import SideBar from '../../../ui/blocks/SideBar';
import SearchLayerContainer from './search-layer/SearchLayerContainer';
import SearchPropertyContainer from './search-property/SearchPropertyContainer';
import { SearchWrapper, RadioWrapper } from './styles';

type Props = {
    suggestionsActive: boolean,
    toggleSearchSuggestions: Function,
    handleRadioChange: Function,
    activeSearch: string,
    propertyAreaSearch: boolean,
    togglePropertyAreaSearch: Function,
};

function SearchView({
    suggestionsActive,
    toggleSearchSuggestions,
    handleRadioChange,
    activeSearch,
    propertyAreaSearch,
    togglePropertyAreaSearch,
}: Props) {
    return (
        <SearchWrapper>
            <SideBar.Header>
                <H1>{strings.search.title}</H1>
                {activeSearch === 'layer'
                && (
                    <div
                        className="toggle-button"
                        tabIndex="0"
                        role="button"
                        onClick={toggleSearchSuggestions}
                        onKeyPress={toggleSearchSuggestions}
                    >
                        <span>{strings.search.suggestions}</span>
                        <i
                            className={
                                suggestionsActive
                                    ? 'fas fa-toggle-on'
                                    : 'fas fa-toggle-off'
                            }
                        />
                    </div>
                )}
                {activeSearch === 'property'
            && (
                <div
                    className="toggle-button"
                    tabIndex="0"
                    role="button"
                    onClick={togglePropertyAreaSearch}
                    onKeyPress={togglePropertyAreaSearch}
                >
                    <span>{strings.searchProperty.areaSearch}</span>
                    <i
                        className={
                            propertyAreaSearch
                                ? 'fas fa-toggle-on'
                                : 'fas fa-toggle-off'
                        }
                    />
                </div>
            )}
            </SideBar.Header>
            <SideBar.Content>
                <RadioWrapper>
                    <Radiobutton htmlFor="layer-nav">
                        {strings.search.layer}
                        <Radiobutton.Input
                            checked={activeSearch === 'layer'}
                            type="radio"
                            id="layer-nav"
                            value="layer"
                            onChange={handleRadioChange}
                        />
                        <Radiobutton.Checkmark />
                    </Radiobutton>
                    <Radiobutton htmlFor="property-nav">
                        {strings.search.property}
                        <Radiobutton.Input
                            checked={activeSearch === 'property'}
                            type="radio"
                            id="property-nav"
                            value="property"
                            onChange={handleRadioChange}
                        />
                        <Radiobutton.Checkmark />
                    </Radiobutton>
                </RadioWrapper>
                {activeSearch === 'layer' && <SearchLayerContainer />}
                {activeSearch === 'property' && <SearchPropertyContainer />}
            </SideBar.Content>
        </SearchWrapper>
    );
}

export default SearchView;
