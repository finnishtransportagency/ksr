import styled from 'styled-components';
import * as styles from '../../../ui/defaultStyles';

export const WrapperReactTable = styled.div`
    background-color: ${styles.colorBackgroundLight};
    height: inherit;
    position: absolute;
    color: ${styles.colorFontDark};
    width: calc(100% - 60px);
    bottom: 0;
    
    .ReactTable .rt-table {
      overflow: scroll
    }
    .ReactTable div[class^="rt-th"]:focus {
      outline: 0
    }    
}
`;
