import styled, { css } from 'styled-components';
import * as styles from '../defaultStyles';

export const TextInput = styled.input`
    padding: 0.5rem;
    outline: red;
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
