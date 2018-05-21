import styled from 'styled-components';
import * as styles from '../../defaultStyles';

import Logo from './Logo';
import Link from './Link';
import LinkWrapper from './LinkWrapper';

const SideNav = styled.div`
    background: ${styles.colorBackgroundDark};
    position: fixed;
    height: 100%;
    top: 0;
    left: 0;
    width: 60px;
    color: ${styles.colorFontLight};
    z-index: 2;
`;

SideNav.Logo = Logo;
SideNav.Link = Link;
SideNav.LinkWrapper = LinkWrapper;

export default SideNav;
