import styled from 'styled-components';
import * as styles from '../../defaultStyles';

const Input = styled.input`
    position: absolute;
    opacity: 0;
    cursor: pointer;
    
    &:checked ~ span {
        background-color: ${styles.colorMain};
    }
    
    &:checked ~ span:after {
        display: block;
    }
`;

export default Input;
