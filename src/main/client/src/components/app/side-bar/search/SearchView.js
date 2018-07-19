// @flow
import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import strings from '../../../../translations';
import { H1, Button, TextInput } from '../../../ui/elements';
import SideBar from '../../../ui/blocks/SideBar';
import LoadingIcon from '../../shared/LoadingIcon';
import SearchFieldView from './search-field/SearchFieldView';
import { SearchWrapper } from './styles';

type Props = {
    handleLayerChange: Function,
    handleAddField: Function,
    handleTextChange: Function,
    handleChangeField: Function,
    handleSubmit: Function,
    handleRemoveField: Function,
    selectedLayer: string,
    queryableLayers: Array<Object>,
    searchFieldValues: Array<Object>,
    textSearch: string,
    optionsField: Array<Object>,
    optionsExpression: Array<Object>,
    fetching: boolean,
};

const SearchView = ({
    handleLayerChange,
    handleAddField,
    handleTextChange,
    handleChangeField,
    handleSubmit,
    handleRemoveField,
    selectedLayer,
    queryableLayers,
    searchFieldValues,
    textSearch,
    optionsField,
    optionsExpression,
    fetching,
}: Props) => (
    <SearchWrapper>
        <SideBar.Header>
            <H1>{strings.search.title}</H1>
        </SideBar.Header>
        <SideBar.Content>
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
                    <label htmlFor="layer">
                        <Select
                            disabled={fetching}
                            onBlurResetsInput={false}
                            onSelectResetsInput={false}
                            options={queryableLayers}
                            simpleValue
                            name="layer"
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
                        />
                    </label>
                    {searchFieldValues.map((a, i) => (
                        <SearchFieldView
                            key={a.id}
                            field={a}
                            index={i}
                            handleChangeField={handleChangeField}
                            optionsExpression={optionsExpression}
                            handleRemoveField={handleRemoveField}
                            fetching={fetching}
                        />
                    ))}
                    <Button disabled={!selectedLayer || fetching}>
                        {strings.search.buttonSearch}
                    </Button>
                    <div hidden={!selectedLayer}>
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
        </SideBar.Content>
    </SearchWrapper>
);

export default SearchView;
