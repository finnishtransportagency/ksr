import styled from 'styled-components';

import Name from './Name';
import Value from './Value';

const ContractFeatureAttribute = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0.75rem 0;
    overflow: hidden;
`;

ContractFeatureAttribute.Name = Name;
ContractFeatureAttribute.Value = Value;

export default ContractFeatureAttribute;
