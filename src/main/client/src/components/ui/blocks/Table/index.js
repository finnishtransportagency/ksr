import styled, { css } from 'styled-components';
import * as styles from '../../defaultStyles';

import LinkToggle from './Link';
import Filter from './Filter';

const Table = styled.div`
    background: ${styles.colorBackgroundDark};
    position: fixed;
    height: 50%;
    bottom: -50%;
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
    
    @media only screen and (max-width: 768px) {
        right: 0;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 60px;
        
        ${props => props.toggleTable && css`
            height: 100%;
        `};
    }
`;

Table.Link = LinkToggle;
Table.Filter = Filter;

export default Table;
