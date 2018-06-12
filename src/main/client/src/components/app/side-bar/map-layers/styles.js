import styled, { css } from 'styled-components';
import { Button } from '../../../ui/elements';

export const ButtonLayerNav = Button.extend`
    width: 50%;
    border-bottom: 5px solid transparent;
    
    ${props => props.activeLayer && css`
        border-bottom: 5px solid;
    `}
`;
