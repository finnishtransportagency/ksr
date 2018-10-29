import styled from 'styled-components';
import * as styles from '../../../ui/defaultStyles';

export const WrapperReactTable = styled.div`
    background-color: ${styles.colorBackgroundDarkSecondary};
    height: calc(100% - 52px);
    top: 52px;
    position: absolute;
    color: ${styles.colorFontDark};
    width: calc(100% - 60px);
    bottom: 0;
    
    .ReactTable {
        border: none;
        box-shadow: inset 0 2px 4px 0 hsla(0, 0%, 0%, 0.25);
        
        .rt-thead.-header {
            padding-top: 4px;
        };
        
        .rt-thead .rt-th.-sort-desc {
            -webkit-box-shadow: inset 0 -3px 0 0 rgb(39, 175, 225);
            -moz-box-shadow: inset 0 -3px 0 0 rgb(39, 175, 225);
            box-shadow: inset 0 -3px 0 0 rgb(39, 175, 225);
        };
        
        .rt-thead .rt-th.-sort-asc {
            -webkit-box-shadow: inset 0 3px 0 0 rgb(39, 175, 225);
            -moz-box-shadow: inset 0 3px 0 0 rgb(39, 175, 225);
            box-shadow: inset 0 3px 0 0 rgb(39, 175, 225);
        };
        
        .rt-resizable-header {
            background: ${styles.colorBackgroundDarkSecondary};
            color: ${styles.colorFontLight};
            padding: 0.5rem;
        };
        
        .rt-thead.-filters {
            background: ${styles.colorBackgroundDarkSecondary};
            border-bottom: 1px solid rgba(0,0,0,0.15);
            
            input {
                border-radius: 0;
                border: 2px solid transparent;
                
                &:focus {
                    border: 2px solid ${styles.colorMain};
                };
            };
        };
        
        .rt-tbody {
            .rt-td {
                padding: 0.75rem 6px;
                text-align: left;
                border-right: 1px solid rgba(0, 0, 0, 0.1);
                
                div {
                    overflow: hidden;
                    text-overflow: ellipsis;
                };
            };
        
            .rt-tr-group {
                border: none;
                background: ${styles.colorBackgroundLight};
            };
        };
        
        div[class^="rt-th"]:focus {
            outline: 0;
        };
        
        .rt-tr {
            min-height: 32px;
            align-items: left;
        };
        
        .rt-thead.-filters .rt-tr {
            min-height: 42px;
        };
        
        .rt-thead.-filters .rt-th:nth-of-type(2) {
            padding-left: 0;
        };
        
        .rt-body .rt-td {
            border: none;
            padding: 0.5rem 0;
        };
    
        .rt-tr > .rt-td:first-of-type {
            background: ${styles.colorBackgroundDarkSecondary};
            width: 35px;
            max-width: 35px;
        };
        
        .pagination-bottom {
            background: ${styles.colorBackgroundDarkSecondary};
            color: ${styles.colorFontLight};
            
            input, select {
                border-radius: 0;
            };
            
            .-btn[disabled], .-btn:not(disabled) {
                background: #FFFFFF;
                color: ${styles.colorFontDark};
                border-radius: 0;
                
                &:hover {
                    background: ${styles.colorBackgroundLight}
                    color: ${styles.colorFontDark};
                };
            };
        };
        
        input[type='checkbox']:hover {
            cursor: pointer;
        };
        
        .content-not-editable {
            outline: none;
        }

        .content-not-valid {
            border: 2px solid ${styles.mapHighlightStroke};
        };
        
        .contract-icon {
            cursor: pointer;
        };
        
        .contract-icon:focus {
            outline: none;
        }
    };

    @media only screen and (max-width: 768px) {
      width: 100%;
      top: 52px;
      height: calc(100% - 60px - 52px);
    };
`;

export const WrapperReactTableNoTable = styled.div`
  text-align: center;
  width: 100%;
  top: 80px;
  position: absolute;
`;
