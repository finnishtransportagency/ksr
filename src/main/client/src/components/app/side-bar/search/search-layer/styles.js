import styled from 'styled-components';
import { InputInfo } from '../../../../ui/elements/TextInput';

export const LabelInfoWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    ${InputInfo} {
        position: relative;
        color: #FFFFFF;
        right: initial;
        top: initial;
    };
`;
