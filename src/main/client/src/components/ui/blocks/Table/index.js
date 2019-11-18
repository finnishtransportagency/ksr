import styled, { css } from 'styled-components';
import * as styles from '../../defaultStyles';

import Button from './Button';
import ButtonWrapper from './ButtonWrapper';

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
   
    ${props => props.tableOpen && css`
        bottom: 0;
    `};

    ${props => props.sideBar && css`
        left: 460px;
        width: calc(100% - 400px);
    `};
    
    @media only screen and (max-width: 768px) {
        right: 0;
        left: 0;
        bottom: 60px;
        width: 100%;
        height: 0;
        
        ${props => props.tableOpen && css`
            height: calc(100% - 80px);
            bottom: 60px;
        `};
    }
`;

Table.Button = Button;
Table.ButtonWrapper = ButtonWrapper;

export default Table;
