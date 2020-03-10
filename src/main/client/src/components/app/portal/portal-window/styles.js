import styled from 'styled-components';
import * as styles from '../../../ui/defaultStyles';

export const PortalWrapper = styled.div`
    background: ${styles.colorBackgroundDark};
    height: 100%;
    width: 100%;

    #TableView {
        position: unset;
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
    };

    #TableView > div {
        position: relative;
        width: 100%;
    };

    #tableView > div:last-of-type {
        top: unset;
    };

    #table-button--wrapper {
        position: absolute;
        top: 0;
        color: ${styles.colorFontLight};
    };

    #table-button--wrapper > div {
        display: inline-flex;
        height: 60px;
        -webkit-align-items: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        -webkit-box-pack: center;
        -webkit-justify-content: center;
        -ms-flex-pack: center;
        justify-content: center;
        font-size: 1.25em;
        width: 60px;
        box-sizing: border-box;
    };

    #table-button--wrapper > div:nth-of-type(6),
    #table-button--wrapper > div:nth-of-type(7),
    #table-button--wrapper > div:nth-of-type(8) {
        border-top: 3px solid ${styles.colorMain};
    };

    #table-button--wrapper > div:nth-of-type(9),
    #table-button--wrapper > div:nth-of-type(10) {
        border-top: 3px solid ${styles.colorTableEdited}; 
    };

    .rt-rtable {
        height: 100%;
    };

    .rtable-scroll-wrapper {
        margin-right: unset !important;
        margin-bottom: unset !important;
        overflow: auto !important;
    };
    
    .track-horizontal,
    .track-vertical {
        display: none;
    };

    .fa-times:before {
        color: ${styles.colorFontLight};
    };
`;
