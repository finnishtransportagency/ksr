// @flow
import React, { Fragment } from 'react';
import { parseColumnType } from '../../../../../utils/type';
import { TextInput } from '../../../../ui/elements';
import { InputInfo, InputWithIcon } from '../../../../ui/elements/TextInput';
import strings from '../../../../../translations';
import LoadingIcon from '../../../shared/LoadingIcon';

type Props = {
    index: number,
    field: Object,
    handleOnChange: Function,
    fetching: boolean,
    contractExists: boolean,
};

const ModalLayerDetailsSingleView = ({
    index, field, handleOnChange, fetching, contractExists,
}: Props) => (
    <Fragment>
        <label
            htmlFor={index}
        >
            {field.label}
            {(!field.nullable) &&
            <InputWithIcon>
                <TextInput
                    backgroundDarker
                    index={index}
                    type={parseColumnType(field.type)}
                    onChange={evt => handleOnChange(evt, field)}
                    name={field.name}
                    value={field.data ? field.data : ''}
                    autoComplete="off"
                    maxLength={field.length}
                    required={!field.nullable}
                />
                <InputInfo
                    data-balloon={!fetching && contractExists
                        ? `${field.label}${' '}${strings.modalFeatureContracts.addEditContract.contractFound}`
                        : null
                    }
                    data-balloon-pos="left"
                    data-balloon-length="large"
                >
                    {!fetching && !contractExists && <i className="fas fa-check" />}
                    {!fetching && contractExists && <i className="fas fa-exclamation-triangle" />}
                    <LoadingIcon size={7} loading={fetching} />
                </InputInfo>
            </InputWithIcon>}
            {(field.nullable) &&
                <TextInput
                    backgroundDarker
                    index={index}
                    type={parseColumnType(field.type)}
                    onChange={evt => handleOnChange(evt, field)}
                    name={field.name}
                    value={field.data ? field.data : ''}
                    autoComplete="off"
                    maxLength={field.length}
                    required={!field.nullable}
                />}
        </label>
    </Fragment>
);

export default ModalLayerDetailsSingleView;
