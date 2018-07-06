import styled, { css } from 'styled-components';
import * as styles from '../../defaultStyles';

import Header from './Header';
import Content from './Content';

const SideBar = styled.div`
    background: ${styles.colorBackgroundDarkSecondary};
    position: fixed;
    height: 100%;
    top: 0;
    left: -400px;
    width: 400px;
    color: ${styles.colorFontLight};
    transition: 0.3s;
    visibility: hidden;
    -webkit-box-shadow: ${styles.shadowDefault};
    -moz-box-shadow: ${styles.shadowDefault};
    box-shadow: ${styles.shadowDefault};
    z-index: 2;
    
    .loading-icon {
        text-align: center;
        margin-top: 2em;
    };
    
    ${props => props.active && css`
        left: 60px;
        visibility: visible;
    `};
    
    @media only screen and (max-width: 768px) {
        left: auto;
        top: auto;
        width: 100%;
        bottom: -100%;
        height: calc(100% - 60px);
        
        ${props => props.active && css`
            bottom: 60px;
        `}
    }
`;

SideBar.Header = Header;
SideBar.Content = Content;

export default SideBar;
