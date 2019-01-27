import styled, { css } from 'styled-components';

import Input from './Input';
import Checkmark from './Checkmark';
import * as styles from '../../defaultStyles';

const Checkbox = styled.label`
    display: block;
    position: relative;
    padding-left: 3rem;
    margin-bottom: 10px;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
          
    &:hover input ~ span {
        background-color: ${styles.colorBackgroundGrey};
    }
    
    input {
        position: absolute;
        opacity: 0;
        cursor: pointer;
    }
    
    ${props => props.layerAllView && css`
        margin-bottom: 0;
        
        span {
            top: ${props.subLayer ? '1px' : '1rem'};
            left: 1rem;
        }
    `};
    
    input:checked ~ span {
        background-color: ${styles.colorMain};
        
        ${props => props.layerAllView && css`
            background-color: ${styles.colorBackgroundLightSecondary};
        `};         
    }
`;

Checkbox.Input = Input;
Checkbox.Checkmark = Checkmark;

export default Checkbox;
