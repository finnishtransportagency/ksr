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
    z-index: 3;
    display: flex;
    flex-direction: column;
    -webkit-box-shadow: ${styles.shadowDefault};
    -moz-box-shadow: ${styles.shadowDefault};
    box-shadow: ${styles.shadowDefault};
    
    @media only screen and (max-width: 768px) {
        height: 60px;
        bottom: 0;
        top: auto;
        width: 100%;
        flex-direction: row;
        justify-content: space-between;
    }
`;

SideNav.Logo = Logo;
SideNav.Link = Link;
SideNav.LinkWrapper = LinkWrapper;

export default SideNav;
