// @flow
import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import strings from '../../../../../translations';
import { Button, TextInput } from '../../../../ui/elements';
import LoadingIcon from '../../../shared/LoadingIcon';
import SearchFieldView from './search-field/SearchFieldView';

type Props = {
    handleLayerChange: Function,
    handleAddField: Function,
    handleTextChange: Function,
    handleChangeField: Function,
    handleFieldBlur: Function,
    handleSubmit: Function,
    handleRemoveField: Function,
    setSearchState: Function,
    selectedLayer: string,
    queryableLayers: Array<Object>,
    searchFieldValues: Array<Object>,
    textSearch: string,
    optionsField: Array<Object>,
    optionsExpression: Array<Object>,
    fetching: boolean,
    suggestions: Array<string>,
    suggestionsActive: boolean,
};

const SearchLayerView = ({
    handleLayerChange,
    handleAddField,
    handleTextChange,
    handleChangeField,
    handleFieldBlur,
    handleSubmit,
    handleRemoveField,
    setSearchState,
    selectedLayer,
    queryableLayers,
    searchFieldValues,
    textSearch,
    optionsField,
    optionsExpression,
    fetching,
    suggestions,
    suggestionsActive,
}: Props) => (
    <Scrollbars
        autoHide
        className="sidebar-content-scroll-wrapper"
        renderView={scrollProps =>
            <div {...scrollProps} className="sidebar-content-scroll-inner" />}
        renderThumbVertical={scrollProps =>
            <div {...scrollProps} className="sidebar-content-scroll-thumb" />}
    >
        <form onSubmit={handleSubmit}>
            <p>{strings.search.chooseLayer}</p>
            <label htmlFor="choose-layer">
                <Select
                    disabled={fetching}
                    onBlurResetsInput={false}
                    onSelectResetsInput={false}
                    options={queryableLayers}
                    simpleValue
                    name="choose-layer"
                    placeholder=""
                    value={selectedLayer}
                    onChange={handleLayerChange}
                    searchable={false}
                />
            </label>
            <label
                htmlFor="allFields"
                hidden={!selectedLayer || searchFieldValues.length > 0}
            >
                <p>{strings.search.searchAllFields}</p>
                <TextInput
                    disabled={fetching}
                    type="text"
                    value={textSearch}
                    onChange={handleTextChange}
                    placeholder=""
                    name="allFields"
                    required={!searchFieldValues.length}
                    minLength={2}
                    autoComplete="off"
                />
            </label>
            {searchFieldValues.map((a, i) => (
                <SearchFieldView
                    key={a.id}
                    field={a}
                    index={i}
                    searchFieldValues={searchFieldValues}
                    setSearchState={setSearchState}
                    selectedLayer={selectedLayer}
                    textSearch={textSearch}
                    handleChangeField={handleChangeField}
                    handleFieldBlur={handleFieldBlur}
                    optionsExpression={optionsExpression}
                    handleRemoveField={handleRemoveField}
                    fetching={fetching}
                    suggestions={suggestions}
                    suggestionsActive={suggestionsActive}
                />
            ))}
            <Button disabled={!selectedLayer || fetching}>
                {strings.search.buttonSearch}
            </Button>
            <div hidden={!selectedLayer || selectedLayer === 'queryAll' ||
        selectedLayer === 'queryActive'}
            >
                <p>{strings.search.addField}</p>
                <label htmlFor="selectField" hidden={!selectedLayer}>
                    <Select
                        disabled={fetching}
                        onBlurResetsInput={false}
                        onSelectResetsInput={false}
                        options={optionsField}
                        simpleValue
                        name="selectField"
                        placeholder=""
                        onChange={handleAddField}
                        searchable={false}
                    />
                </label>
            </div>
            <LoadingIcon loading={fetching} />
        </form>
    </Scrollbars>
);

export default SearchLayerView;