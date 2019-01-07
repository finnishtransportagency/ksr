// @flow
import React from 'react';
import ModalLayerDetailsSingleView from './modal-layer-details-single/ModalLayerDetailsSingleView';

type Props = {
    fields: Array<Object>,
    handleOnChange: Function,
    fetching: boolean,
    validContract: boolean,
};

const ModalLayerDetailsView = ({
    fields, handleOnChange, fetching, validContract,
}: Props) => (
    <form>
        {fields && fields.filter(field => field.type !== 'esriFieldTypeOID' && !field.nullable).map((field, i) => (
            <ModalLayerDetailsSingleView
                key={field.value}
                index={i}
                field={field}
                handleOnChange={handleOnChange}
                fetching={fetching}
                validContract={validContract}
            />
        ))}
        {fields && fields.filter(field => field.type !== 'esriFieldTypeOID' && field.nullable).map((field, i) => (
            <ModalLayerDetailsSingleView
                key={field.value}
                index={i}
                field={field}
                handleOnChange={handleOnChange}
                fetching={fetching}
                validContract={validContract}
            />
        ))}
    </form>
);

export default ModalLayerDetailsView;
