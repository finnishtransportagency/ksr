import styled, { css } from 'styled-components';
import * as styles from '../../../ui/defaultStyles';

export const WrapperReactTable = styled.div`
    background-color: ${styles.colorBackgroundDarkSecondary};
    height: calc(100% - 52px);
    top: 52px;
    position: absolute;
    color: ${styles.colorFontDark};
    width: calc(100% - 60px);
    bottom: 0;
    
    div.ReactTable {
        border: none;
        box-shadow: inset 0 2px 4px 0 hsla(0, 0%, 0%, 0.25);
        
        .rt-thead.-header {
            background: ${styles.colorBackgroundDarkSecondary};
            padding-top: 4px;

            .rt-th.rthfc-th-fixed.rthfc-th-fixed-left,
            .rt-th.rthfc-th-fixed.rthfc-th-fixed-left.rthfc-th-fixed-left-last,
            .rt-td.rthfc-td-fixed.rthfc-td-fixed-left,
            .rt-td.rthfc-td-fixed.rthfc-td-fixed-left.rthfc-td-fixed-left-last {
                min-width: 30px;
            };
        };
        
        .rt-th {
            background: ${styles.colorBackgroundDarkSecondary};
            min-height: 35px;
            min-width: 30px;
            border-bottom: none;
            border-right: 1px solid rgba(0, 0, 0, 0.1) !important;
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
            color: ${styles.colorFontLight};
            padding: 0.5rem;
            min-width: 130px;
        };
        
        .rt-thead.-filters {
            background: ${styles.colorBackgroundDarkSecondary};
            border-bottom: 1px solid rgba(0,0,0,0.15);
            
            .rt-tr, .rt-th {
                min-height: 42px;
            };

            .rt-th {
                min-width: 130px;
            };

            .rt-th.rthfc-th-fixed.rthfc-th-fixed-left,
            .rt-th.rthfc-th-fixed.rthfc-th-fixed-left.rthfc-th-fixed-left-last,
            .rt-td.rthfc-td-fixed.rthfc-td-fixed-left,
            .rt-td.rthfc-td-fixed.rthfc-td-fixed-left.rthfc-td-fixed-left-last {
                min-width: 30px;
            };
            
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
                border-right: 1px solid rgba(0, 0, 0, 0.1) !important;
                height: 42px;
                min-width: 130px;
                background-color: transparent;
                
                div {
                    overflow: hidden;
                    text-overflow: ellipsis;
                };
                
                &.decimal {
                    text-align: right;
                };

                &.date {
                    min-width: 130px;
                }
            };
        
            .rt-tr-group {
                border: none;
                background: ${styles.colorBackgroundLight};
                max-height: 42px;
            };

            .rt-th.rthfc-th-fixed.rthfc-th-fixed-left,
            .rt-th.rthfc-th-fixed.rthfc-th-fixed-left.rthfc-th-fixed-left-last,
            .rt-td.rthfc-td-fixed.rthfc-td-fixed-left,
            .rt-td.rthfc-td-fixed.rthfc-td-fixed-left.rthfc-td-fixed-left-last {
                min-width: 30px;
            };
        };
        
        div[class^="rt-th"]:focus {
            outline: 0;
        };
        
        .rt-tr {
            align-items: flex-start;
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
            border: 2px solid ${styles.colorDanger};
        };
        
        .contract-icon {
            cursor: pointer;
        };
        
        .contract-icon:hover {
            color: ${styles.colorMain};
        }
        
        .contract-icon:focus {
            outline: none;
        }
        
        .track-vertical {
            position: absolute;
            width: 8px !important;
            top: 84px;
            right: 2px;
            bottom: 2px;
            border-radius: 3px;
        };
        
        .track-horizontal {
            position: absolute;
            height: 8px !important;
            left: 32px;
            right: 2px;
            bottom: 2px;
            border-radius: 3px;
        };
    
        ${props => props.columns && props.columns.length && props.columns[0].fixed && css`
            .track-horizontal {
                left: calc(32px + (${props.columns[0].columns.length} * 30px));
            };
        `};
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

export const TableSelect = styled.select`
    width: 100%;
`;

export const TableInput = styled.input`
    width: 100%;
`;
