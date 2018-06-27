import styled from 'styled-components';
import * as styles from '../defaultStyles';

export const TextInput = styled.input`
    padding: 0.5rem;
    outline: red;
    box-sizing: border-box;
    width: 100%;
    border: 2px solid transparent;
    font-size: 1em;
    
    &:focus {
        border: 2px solid ${styles.colorMain};
    }
`;
