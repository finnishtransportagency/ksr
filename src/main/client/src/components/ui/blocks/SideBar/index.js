import styled, { css } from 'styled-components';
import * as styles from '../../defaultStyles';

import Header from './Header';
import Content from './Content';

const SideBar = styled.div`
    background: ${styles.colorBackgroundDarkSecondary};
    position: fixed;
    height: 100%;
    top: 0;
    left: -300px;
    width: 300px;
    color: ${styles.colorFontLight};
    transition: 0.3s;
    visibility: hidden;
    
    ${props => props.active && css`
        left: 60px;
        visibility: visible;
    `}
`;

SideBar.Header = Header;
SideBar.Content = Content;

export default SideBar;
