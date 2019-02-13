import styled, { css } from 'styled-components';
import * as styles from '../defaultStyles';

export const TextInput = styled.input`
    padding: 0.5rem;
    outline: none;
    box-sizing: border-box;
    width: 100%;
    border: 1px solid ${styles.colorBackgroundLightSecondary};
    font-size: 1em;
    
    ${props => props.backgroundDarker && css`
        background-color: ${styles.colorBackgroundLight};
        margin: 0.25rem 0 1rem;
    `}
    
    &:focus {
        border: 1px solid ${styles.colorMain};
    }

    &:invalid {
        border: 1px solid ${styles.colorDanger};
    }
`;

export const InputInfo = styled.div`
    position: absolute;
    font-size: 1.5rem;
    right: 0.6rem;
    top: 0.2rem;
    color: ${styles.colorMain};
`;

export const InputWithIcon = styled.div`
    position: relative; 
    background: #FFFFFF;
    margin-bottom: 1rem;
    margin-top: 0.25rem;
    
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
    
    .fa-exclamation-triangle {
        color: ${styles.colorDanger}
    }
`;
