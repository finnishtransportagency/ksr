// @flow
import React, { Fragment } from 'react';
import strings from '../../../../../translations';
import { InputWithIcon, TextInput, InputInfo } from '../../../../ui/elements/TextInput';
import LoadingIcon from '../../../shared/LoadingIcon';

type Props = {
    handleInputChange: (evt: Object) => void,
    contractNumber: number | string,
    fetching: boolean,
    contractExists: boolean,
};

function LinkContractView({
    handleInputChange,
    contractNumber,
    fetching,
    contractExists,
}: Props): React$Element<"label"> {
    return (
        <label htmlFor={strings.modalFeatureContracts.linkContract.contractNumber}>
            <span>{strings.modalFeatureContracts.linkContract.contractNumber}</span>
            <InputWithIcon>
                <TextInput
                    backgroundDarker
                    placeholder=""
                    name="name"
                    autoComplete="off"
                    onChange={handleInputChange}
                    value={contractNumber}
                    maxLength={30}
                />
                <InputInfo
                    data-balloon={!fetching && contractNumber && !contractExists
                        ? strings.modalFeatureContracts.linkContract.noContractFound
                        : null}
                    data-balloon-pos="left"
                    data-balloon-length="large"
                >
                    {!fetching && contractNumber && contractExists && <i className="fas fa-check" />}
                    {!fetching && contractNumber && !contractExists && <i className="fas fa-exclamation-triangle" />}
                    <LoadingIcon size={7} loading={fetching} />
                </InputInfo>
            </InputWithIcon>
        </label>
    );
}

export default LinkContractView;
