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
`;
