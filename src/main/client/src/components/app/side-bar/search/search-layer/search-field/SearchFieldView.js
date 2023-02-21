// @flow
import React from 'react';
import Downshift from 'downshift';
import { Scrollbars } from 'react-custom-scrollbars';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { TextInput } from '../../../../../ui/elements';
import SearchFieldWrapper from './styles';
import { codedValueOptions, filterExpressionsByType } from '../../../../../../utils/search/parseQueryString';
import { toDisplayDate } from '../../../../../../utils/date';

type Props = {
    field: Object,
    index: number,
    setSearchState: Function,
    selectedLayer: string,
    textSearch: string,
    handleChangeField: Function,
    handleFieldBlur: Function,
    handleRemoveField: Function,
    fetching: boolean,
    suggestions: Array<string>,
    suggestionsActive: boolean,
    // eslint-disable-next-line react/require-default-props
    searchFieldValues?: Array<Object>,
};

function SearchFieldView({
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
}: Props): React$Element<React$FragmentType> {
    return (
        <SearchFieldWrapper>
            {searchFieldValues && (
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
            )}
            <SearchFieldWrapper.Inputs>
                {searchFieldValues
            && !searchFieldValues[index].domain
            && field.type !== 'esriFieldTypeDate'
            && (
                <SearchFieldWrapper.Expression
                    onClick={e => e.preventDefault()}
                >
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
            )}
                <SearchFieldWrapper.Text
                    onClick={(e) => {
                        if (field.type !== 'esriFieldTypeDate') {
                            e.preventDefault();
                        }
                    }}
                >
                    {searchFieldValues
                && searchFieldValues[index].domain
                && field.type !== 'esriFieldTypeDate'
                && (
                    <Select
                        disabled={fetching}
                        value={field.queryText.toString()
                        || searchFieldValues[index].domain.codedValues.find(cv => cv.name)}
                        onChange={evt => handleChangeField('codedValue', evt, index)}
                        options={codedValueOptions(searchFieldValues[index].domain.codedValues)}
                        simpleValue
                        clearable={false}
                        searchable={false}
                        backspaceRemoves={false}
                        deleteRemoves={false}
                    />
                )}
                    {(!searchFieldValues
                || (!searchFieldValues[index].domain
                && field.type !== 'esriFieldTypeDate'))
                && (
                    <Downshift onSelect={
                        searchFieldValues
                            ? (selectedItem) => {
                                searchFieldValues[index].queryText = selectedItem;
                                setSearchState(
                                    selectedLayer,
                                    textSearch,
                                    searchFieldValues,
                                    [],
                                    suggestionsActive,
                                );
                            }
                            : (selectedItem) => {
                                setSearchState(
                                    selectedLayer,
                                    selectedItem,
                                    searchFieldValues,
                                    [],
                                    suggestionsActive,
                                );
                            }
                    }
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
                                            handleChangeField(searchFieldValues ? 'text' : 'text-all-columns', evt, index);
                                        },
                                    })}
                                    disabled={fetching}
                                    type="text"
                                    value={searchFieldValues ? field.queryText : textSearch}
                                    index={index}
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
                )}
                    {field.type === 'esriFieldTypeDate'
                && (
                    <TextInput
                        name={field.name}
                        type="date"
                        value={field.queryDate}
                        title={toDisplayDate(field.queryDate)}
                        onChange={evt => handleChangeField('date', evt, index)}
                    />
                )}
                </SearchFieldWrapper.Text>
            </SearchFieldWrapper.Inputs>
        </SearchFieldWrapper>
    );
}

export default SearchFieldView;
