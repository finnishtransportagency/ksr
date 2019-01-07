import styled from 'styled-components';
import { RadioWrapper } from '../../side-bar/search/styles';

export const ModalThemeLayerWrapper = styled.div`
    ${RadioWrapper} {
        flex-direction: column;
        padding-top: 0;
        
        label {
            margin-top: 1rem;
        };
    };
    
    .Select-control .Select-input:focus {
        background-color: #F1F1F1;
    }
`;
