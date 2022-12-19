import styled, { css } from 'styled-components';
import { Button } from '../../../ui/elements';



export const ButtonLayerNav = styled(Button)`
    width: 50%;
    border-bottom: 5px solid transparent;
    
    ${props => props.activeLayer && css`
        border-bottom: 5px solid;
    `}
`;

export const ButtonLayerNavWrapper = styled.div`
    padding: 0 1rem;
`;

export const ButtonLayerAddWrapper = styled.div`
    padding: 0 1rem;
    position: absolute;
    bottom: 0;
    width: calc(100% - 2rem);
    
    button {
        width: calc(50% - 0.5rem);
        
        &:first-of-type {
            margin-right: 0.5rem;
        }
        
        &:last-of-type {
            margin-left: 0.5rem;
        }
    }
`;

export const LayerFilterWrapper = styled.div`
    padding: 0 1rem;
`;

export const ToggleButtonWrapper = styled.div`
    text-align: right;
    background: #4cd964;
`;

export const ToggleButton = styled.div`
    padding: 0 0 0.25em 0;
    outline: none;
    span {
        margin-right: 0.5rem;
    }
`;
