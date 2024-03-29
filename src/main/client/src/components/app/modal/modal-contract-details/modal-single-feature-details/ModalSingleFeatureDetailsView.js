// @flow
import React from 'react';
import ContractFeatureAttribute from '../../../../ui/blocks/ContractFeatureAttribute';
import strings from '../../../../../translations/fi';

type Props = {
    featureAttributes: Object[],
};

function ModalSingleFeatureDetailsView({ featureAttributes }: Props): any {
    return featureAttributes.length > 0
        ? featureAttributes.map(attribute => (
            attribute.value !== null
            && attribute.value !== undefined
            && attribute.value !== ''
            && !attribute.hidden && (
                <ContractFeatureAttribute key={attribute.label}>
                    <ContractFeatureAttribute.Name>
                        {attribute.label}
                    </ContractFeatureAttribute.Name>
                    <ContractFeatureAttribute.Value>
                        {attribute.value}
                    </ContractFeatureAttribute.Value>
                </ContractFeatureAttribute>
            )
        ))
        : <p>{strings.modalContractDetails.errorNoAttributesFound}</p>;
}

export default ModalSingleFeatureDetailsView;
