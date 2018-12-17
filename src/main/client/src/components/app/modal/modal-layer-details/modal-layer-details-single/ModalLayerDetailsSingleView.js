// @flow
import React, { Fragment } from 'react';

import { InputInfo, InputWithIcon } from '../../../../ui/elements/TextInput';
import strings from '../../../../../translations';
import LoadingIcon from '../../../shared/LoadingIcon';
import ModalLayerDetailsSingleViewInput from './ModalLayerDetailsSingleViewInput';

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
                <ModalLayerDetailsSingleViewInput
                    field={field}
                    handleOnChange={handleOnChange}
                    index={index}
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
            {field.nullable &&
                <ModalLayerDetailsSingleViewInput
                    field={field}
                    handleOnChange={handleOnChange}
                    index={index}
                />
            }
        </label>
    </Fragment>
);

export default ModalLayerDetailsSingleView;
