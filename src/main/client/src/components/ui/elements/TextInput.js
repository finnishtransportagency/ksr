import styled, { css } from 'styled-components';
import * as styles from '../defaultStyles';

export const TextInput = styled.input`
    padding: 0.5rem;
    outline: none;
    box-sizing: border-box;
    width: 100%;
    border: 2px solid transparent;
    font-size: 1em;
    
    ${props => props.backgroundDarker && css`
        background-color: ${styles.colorBackgroundLight};
        margin: 0.25rem 0 1rem;
    `}
    
    &:focus {
        border: 2px solid ${styles.colorMain};
    }
`;

export const InputInfo = styled.div`
    position: absolute;
    font-size: 1.5rem;
    right: 0.6rem;
    top: 0.3rem;
    color: ${styles.colorMain};
`;

export const InputWithIcon = styled.div`
    position: relative; 
    background: ${styles.colorBackgroundLight};
    margin-bottom: 1rem;
    
    input {
        margin: 0;
        width: calc(100% - 3rem);
    }
    
    input[type=number]::-webkit-inner-spin-button, 
    input[type=number]::-webkit-outer-spin-button { 
        -webkit-appearance: none; 
        margin: 0; 
    }
    
    input[type=number] {
        -moz-appearance: textfield;
    }
    
    .Select-control {
        &:hover {
            cursor: pointer;
        }
    }
    
    .Select-control > *:last-child {
        padding-right: 3rem;
    }
`;
