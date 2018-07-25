import styled, { css } from 'styled-components';
import * as styles from '../../defaultStyles';

const Button = styled.div`
    background: ${styles.colorBackgroundDark};
    display: flex;
    height: 60px;
    align-items: center;
    justify-content: center;
    font-size: 1.25em;
    left: 0;
    visibility: hidden;
    width: 60px;
    
    &:hover {
        cursor: pointer;
        background: ${styles.colorBackgroundDarkSecondary};
    };
    
    ${props => props.tableOpen && css`
        left: 0;
        position: relative;
        visibility: visible;
    `};
    
    ${props => props.toggleButton && css`
        visibility: visible;
    `};
    
    ${props => props.disabled && css`
        color: ${styles.colorFontDisabled};
        
        &:hover {
            cursor: default;
            background: ${styles.colorBackgroundDark};
        };
    `};
`;

export default Button;
