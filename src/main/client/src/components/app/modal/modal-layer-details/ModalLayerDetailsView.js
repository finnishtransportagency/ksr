// @flow
import React from 'react';
import ModalLayerDetailsSingleView from './modal-layer-details-single/ModalLayerDetailsSingleView';

type Props = {
    fields: Array<Object>,
    handleOnChange: Function,
};

const ModalLayerDetailsView = ({ fields, handleOnChange }: Props) => (
    <form>
        {fields && fields.map((c, i) => (
            <ModalLayerDetailsSingleView
                key={c.value}
                index={i}
                field={c}
                handleOnChange={handleOnChange}
            />
        ))}
    </form>
);

export default ModalLayerDetailsView;
