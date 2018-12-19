// @flow
import React from 'react';
import ModalLayerDetailsSingleView from './modal-layer-details-single/ModalLayerDetailsSingleView';

type Props = {
    fields: Array<Object>,
    handleOnChange: Function,
    fetching: boolean,
    contractExists: boolean,
};

const ModalLayerDetailsView = ({
    fields, handleOnChange, fetching, contractExists,
}: Props) => (
    <form>
        {fields && fields.filter(field => field.type !== 'esriFieldTypeOID' && !field.nullable).map((field, i) => (
            <ModalLayerDetailsSingleView
                key={field.value}
                index={i}
                field={field}
                handleOnChange={handleOnChange}
                fetching={fetching}
                contractExists={contractExists}
            />
        ))}
        {fields && fields.filter(field => field.type !== 'esriFieldTypeOID' && field.nullable).map((field, i) => (
            <ModalLayerDetailsSingleView
                key={field.value}
                index={i}
                field={field}
                handleOnChange={handleOnChange}
                fetching={fetching}
                contractExists={contractExists}
            />
        ))}
    </form>
);

export default ModalLayerDetailsView;
