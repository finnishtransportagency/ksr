import styled from 'styled-components';
import * as styles from '../../defaultStyles';

import Header from './Header';
import Content from './Content';

const SideBar = styled.div`
    background: ${styles.colorBackgroundDarkSecondary};
    position: fixed;
    height: 100%;
    top: 0;
    left: 60px;
    width: 300px;
    color: ${styles.colorFontLight}
`;

SideBar.Header = Header;
SideBar.Content = Content;

export default SideBar;
