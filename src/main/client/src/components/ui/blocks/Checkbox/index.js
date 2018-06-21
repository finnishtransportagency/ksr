import styled from 'styled-components';

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
    input:checked ~ span {
        background-color: ${styles.colorMain};
    }
`;

Checkbox.Input = Input;
Checkbox.Checkmark = Checkmark;

export default Checkbox;
