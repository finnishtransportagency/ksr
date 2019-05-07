import styled from 'styled-components';
import * as styles from '../../defaultStyles';
import Checkmark from './Checkmark';

const Input = styled.input`
    position: absolute;
    opacity: 0;
    cursor: pointer;
        
    &:checked ~ ${Checkmark} {
        background-color: ${styles.colorMainDark};
    }

    &:checked ~ ${Checkmark}:after {
        display: block;
    }
`;

export default Input;
