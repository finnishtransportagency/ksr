// @flow
import React from 'react';
import ContractFeatureAttribute from '../../../ui/blocks/ContractFeatureAttribute';

type Props = {
    featureData: Object[],
}

const ModalSingleFeatureInfoView = (props: Props) => {
    const { featureData } = props;

    return (
        featureData.map(feature => (
            <ContractFeatureAttribute key={feature.label}>
                <ContractFeatureAttribute.Name>
                    {feature.label}
                </ContractFeatureAttribute.Name>
                <ContractFeatureAttribute.Value>
                    {feature.value}
                </ContractFeatureAttribute.Value>
            </ContractFeatureAttribute>
        ))
    );
};

export default ModalSingleFeatureInfoView;
