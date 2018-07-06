import styled from 'styled-components';
import * as styles from '../../../ui/defaultStyles';

export const WrapperReactTable = styled.div`
    background-color: ${styles.colorBackgroundLight};
    height: calc(100% - 80px);
    top: 80px;
    position: absolute;
    color: ${styles.colorFontDark};
    width: calc(100% - 60px);
    bottom: 0;

    .ReactTable div[class^="rt-th"]:focus {
        outline: 0;
    }
    
    .ReactTable .rt-tr {
        min-height: 32px;
        align-items: center;
    }
    
    .ReactTable .rt-thead.-filters .rt-tr {
        min-height: 42px;
    }
    
    @media only screen and (max-width: 768px) {
        width: 100%;
        top: 60px;
        height: calc(100% - 120px);
    }
`;

export const WrapperReactTableNoTable = styled.div`
  text-align: center;
  width: 100%;
  top: 80px;
  position: absolute;
`;
