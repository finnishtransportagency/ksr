import styled, { css } from 'styled-components';
import * as styles from '../../defaultStyles';

const Link = styled.div`
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    height: 60px;
    width: 60px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25em;
    
    &:hover {
        cursor: pointer;
        border-left: 5px solid ${styles.colorMainHighlight};
        background: ${styles.colorBackgroundDarkSecondary};
    };
    
    ${props => props.active && css`
        border-left: 5px solid ${styles.colorMain};
    `};
    
    @media only screen and (max-width: 768px) {
        border-left: none;
        border-right: none;
        border-bottom: 5px solid transparent;
        border-top: 5px solid transparent;
        
        &:hover {
                cursor: pointer;
                border-bottom: 5px solid ${styles.colorMainHighlight};
                border-left: none;
                background: ${styles.colorBackgroundDarkSecondary};
        };
        
        ${props => props.active && css`
            border-bottom: 5px solid ${styles.colorMain};
        `};
    }
`;

export default Link;
