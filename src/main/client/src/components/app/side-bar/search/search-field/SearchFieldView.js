// @flow
import React from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { TextInput } from '../../../../ui/elements';
import SearchFieldWrapper from './styles';

type Props = {
    field: Object,
    index: number,
    handleChangeField: Function,
    optionsExpression: Array<Object>,
    handleRemoveField: Function,
    fetching: boolean,
};

const SearchFieldView = ({
    field,
    index,
    handleChangeField,
    optionsExpression,
    handleRemoveField,
    fetching,
}: Props) => (
    <SearchFieldWrapper>
        <SearchFieldWrapper.Title>
            <div>{field.name}</div>
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
                    onChange={evt =>
                        handleChangeField('expression', evt, index)
                    }
                    options={optionsExpression}
                    simpleValue
                    clearable={false}
                    searchable={false}
                />
            </SearchFieldWrapper.Expression>
            <SearchFieldWrapper.Text>
                <TextInput
                    disabled={fetching}
                    type="text"
                    value={field.queryText}
                    index={index}
                    onChange={evt =>
                        handleChangeField('text', evt, index)
                    }
                    required
                    minLength={1}
                />
            </SearchFieldWrapper.Text>
        </SearchFieldWrapper.Inputs>
    </SearchFieldWrapper>
);

export default SearchFieldView;
