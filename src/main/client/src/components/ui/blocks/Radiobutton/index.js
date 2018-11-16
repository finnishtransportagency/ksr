import styled from 'styled-components';
import * as styles from '../../defaultStyles';
import Input from './Input';
import Checkmark from './Checkmark';

const Radiobutton = styled.label`
    position: relative;
    padding-left: 1.5rem;
    padding-right: 1rem;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    
    &:hover ${Input}:checked ~ ${Checkmark} {
        background-color: ${styles.colorMain};
    }

    &:hover ${Input}:not(:checked) ~ ${Checkmark} {
        background-color: ${styles.colorFontDisabled};
    }

    ${Checkmark}:after {
        top: 5px;
        left: 5px;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #FFFFFF;
    }
`;

Radiobutton.Input = Input;
Radiobutton.Checkmark = Checkmark;

export default Radiobutton;
