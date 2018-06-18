import styled, { css } from 'styled-components';
import * as styles from '../../defaultStyles';

import LinkToggle from './Link';

const Table = styled.div`
    background: ${styles.colorBackgroundDark};
    position: fixed;
    height: 400px;
    bottom: -540px;
    left: 60px;
    width: 100%;
    color: ${styles.colorFontLight};
    transition: 0.3s;
    -webkit-box-shadow: ${styles.shadowDefault};
    -moz-box-shadow: ${styles.shadowDefault};
    box-shadow: ${styles.shadowDefault};
   
    ${props => props.toggleTable && css`
        bottom: 0;
    `};

    ${props => props.sideBar && css`
        left: 460px;
        width: calc(100% - 400px);
    `};
`;

Table.Link = LinkToggle;

export default Table;
