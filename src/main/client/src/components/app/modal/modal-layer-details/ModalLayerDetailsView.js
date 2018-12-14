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
        {fields && fields.filter(f => f.type !== 'esriFieldTypeOID').map((c, i) => (
            <ModalLayerDetailsSingleView
                key={c.value}
                index={i}
                field={c}
                handleOnChange={handleOnChange}
                fetching={fetching}
                contractExists={contractExists}
            />
        ))}
    </form>
);

export default ModalLayerDetailsView;
