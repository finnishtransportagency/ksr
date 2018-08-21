// @flow
import React, { Fragment } from 'react';
import ModalLayerDetailsSingleView from './modal-layer-details-single/ModalLayerDetailsSingleView';

type Props = {
    fields: Array<Object>,
    handleOnChange: Function,
};

const ModalLayerDetailsView = ({ fields, handleOnChange }: Props) => (
    <Fragment>
        {fields && fields.map((c, i) => (
            <ModalLayerDetailsSingleView
                key={c.value}
                index={i}
                field={c}
                handleOnChange={handleOnChange}
            />
        ))}
    </Fragment>
);

export default ModalLayerDetailsView;
