// @flow
import React from 'react';
import Downshift from 'downshift';
import { Scrollbars } from 'react-custom-scrollbars';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { TextInput } from '../../../../../ui/elements';
import SearchFieldWrapper from './styles';
import { filterExpressionsByType } from '../../../../../../utils/search/parseQueryString';

type Props = {
    field: Object,
    index: number,
    searchFieldValues: Array<Object>,
    setSearchState: Function,
    selectedLayer: string,
    textSearch: string,
    handleChangeField: Function,
    handleFieldBlur: Function,
    handleRemoveField: Function,
    fetching: boolean,
    suggestions: Array<string>,
    suggestionsActive: boolean,
};

const SearchFieldView = ({
    field,
    index,
    searchFieldValues,
    setSearchState,
    selectedLayer,
    textSearch,
    handleChangeField,
    handleFieldBlur,
    handleRemoveField,
    fetching,
    suggestions,
    suggestionsActive,
}: Props) => (
    <SearchFieldWrapper>
        <SearchFieldWrapper.Title>
            <div>{field.label}</div>
            <SearchFieldWrapper.Remove
                role="button"
                tabIndex={index}
                onClick={() => handleRemoveField(index)}
                onKeyUp={() => handleRemoveField(index)}
            >
                <i className="fas fa-times" />
            </SearchFieldWrapper.Remove>
        </SearchFieldWrapper.Title>
        <SearchFieldWrapper.Inputs>
            <SearchFieldWrapper.Expression>
                <Select
                    disabled={fetching}
                    value={field.queryExpression}
                    onChange={evt => handleChangeField('expression', evt, index)}
                    options={filterExpressionsByType(field.type)}
                    simpleValue
                    clearable={false}
                    searchable={false}
                    backspaceRemoves={false}
                    deleteRemoves={false}
                />
            </SearchFieldWrapper.Expression>
            <SearchFieldWrapper.Text>
                <Downshift onSelect={(selectedItem) => {
                    searchFieldValues[index].queryText = selectedItem;
                    setSearchState(
                        selectedLayer,
                        textSearch,
                        searchFieldValues,
                        [],
                        suggestionsActive,
                    );
                }}
                >
                    {({
                        getInputProps,
                        getItemProps,
                        getMenuProps,
                        highlightedIndex,
                        isOpen,
                    }) => (
                        <div className="suggestion-outer-wrapper">
                            <TextInput
                                {...getInputProps({
                                    onChange: (evt) => {
                                        handleChangeField('text', evt, index);
                                    },
                                })}
                                disabled={fetching}
                                type="text"
                                value={field.queryText}
                                index={index}
                                required
                                minLength={1}
                                onBlur={handleFieldBlur}
                            />
                            <div
                                {...getMenuProps()}
                                hidden={!isOpen || !suggestions || !suggestions.length}
                                className="suggestion-inner-wrapper"
                            >
                                <Scrollbars autoHide autoHeight>
                                    {isOpen && suggestions && suggestions.length ? (
                                        suggestions.map((item, ind) => (
                                            <div
                                                {...getItemProps({ key: ind, ind, item })}
                                                className={highlightedIndex === ind
                                                    ? 'suggestion highlight'
                                                    : 'suggestion'}
                                            >
                                                {item.length > 30 ? `${item.slice(0, 30)}...` : item}
                                            </div>
                                        ))
                                    ) : null}
                                </Scrollbars>
                            </div>
                        </div>
                    )}
                </Downshift>
            </SearchFieldWrapper.Text>
        </SearchFieldWrapper.Inputs>
    </SearchFieldWrapper>
);

export default SearchFieldView;
