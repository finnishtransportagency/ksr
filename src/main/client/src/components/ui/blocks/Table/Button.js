import styled, { css } from 'styled-components';
import * as styles from '../../defaultStyles';

const Button = styled.div`
    background: ${styles.colorBackgroundDark};
    display: none;
    height: 60px;
    align-items: center;
    justify-content: center;
    font-size: 1.25em;
    left: 0;
    width: 60px;
    box-sizing: border-box;
    border-top: 3px solid transparent;
    
    &:hover {
        cursor: pointer;
        background: ${styles.colorBackgroundDarkSecondary};
    };
    
    ${props => props.tableOpen && css`
        left: 0;
        position: relative;
        display: flex;
    `};
    
    ${props => props.toggleButton && css`
        display: flex;
    `};
    
    ${props => props.disabled && css`
        color: ${styles.colorFontDisabled};
        
        &:hover {
            cursor: default;
            background: ${styles.colorBackgroundDark};
        };
    `};
    
    ${props => props.activeLayer && css`
        border-top: 3px solid ${styles.colorMain};
    `};
    
    ${props => props.admin && css`
        border-top: 3px solid ${styles.colorTableEdited};
    `};
    
    @media only screen and (max-width: 768px) {
        border-top: 2px solid transparent;
    
        ${props => props.activeLayer && css`
            border-top: 2px solid ${styles.colorMain};
        `};
        
        ${props => props.admin && css`
            border-top: 2px solid ${styles.colorTableEdited};
        `};
    }
`;

export default Button;
