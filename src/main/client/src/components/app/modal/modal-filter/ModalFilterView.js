// @flow
import React, { Fragment } from 'react';
import Checkbox from '../../../ui/blocks/Checkbox';
import { ModalFilterWrapper, CheckboxWrapper, Description } from './styles';
import strings from '../../../../translations';

type Props = {
    columns: Array<Object>,
    handleOnChange: (name: string) => void,
};

function ModalFilterView({ columns, handleOnChange }: Props): React$Element<React$FragmentType> {
    return (
        <>
            <Description>{strings.modalFilter.description}</Description>
            <ModalFilterWrapper>
                {
                    columns.map(c => (
                        <CheckboxWrapper key={c.Header}>
                            <Checkbox className="content-checkbox" htmlFor={c.Header}>
                                <p title={c.Header}>{c.Header}</p>
                                <Checkbox.Input
                                    id={c.Header}
                                    name={c.Header}
                                    type="checkbox"
                                    checked={c.show}
                                    onChange={() => {
                                        handleOnChange(c.Header);
                                    }}
                                />
                                <Checkbox.Checkmark />
                            </Checkbox>
                        </CheckboxWrapper>
                    ))
                }
            </ModalFilterWrapper>
        </>
    );
}

export default ModalFilterView;
