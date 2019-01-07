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
    validContract: boolean,
};

const ModalLayerDetailsSingleView = ({
    index, field, handleOnChange, fetching, validContract,
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
                    data-balloon={(!fetching && !validContract) || (field.data.trim().length === 0)
                        ? `${field.label} ${strings.modalFeatureContracts.addEditContract.contractFound}`
                        : null
                    }
                    data-balloon-pos="left"
                    data-balloon-length="large"
                >
                    {!fetching && validContract && field.data.trim().length > 0 && <i className="fas fa-check" />}
                    {((!fetching && !validContract) || (field.data.trim().length === 0)) && <i className="fas fa-exclamation-triangle" />}
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
