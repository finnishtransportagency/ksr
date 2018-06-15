import styled, { css } from 'styled-components';
import * as styles from '../../defaultStyles';

const LinkToggle = styled.div`
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    background: ${styles.colorBackgroundDark};
    width: 60px;
    display: flex;
    flex-direction: column;
    position: relative;
    left: 0;
    top: -200px;
    height: 60px;
    box-sizing: border-box;
    align-items: center;
    justify-content: center;
    font-size: 1.25em;
    transition: 0.3s;
    
    &:hover {
        cursor: pointer;
        background: ${styles.colorBackgroundDarkSecondary};
    };
    
    ${props => props.toggleTable && css`
        top: -60px;

    `};
    
    @media only screen and (max-width: 768px) {
        border-left: none;
        border-right: none;
        border-bottom: 5px solid transparent;
        border-top: 5px solid transparent;
        
        &:hover {
            cursor: pointer;
            background: ${styles.colorBackgroundDarkSecondary};
        };
        
        ${props => props.toggleTable && css`
            border-bottom: 5px solid ${styles.colorMain};
        `};
    }
`;

export default LinkToggle;
