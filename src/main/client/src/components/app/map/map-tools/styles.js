import styled, { css } from 'styled-components';
import * as styles from '../../../ui/defaultStyles';

export const DrawToolOuterWrapper = styled.div`
    display: flex;
    flex-direction: row-reverse;
    
    .esri-widget--button {
        margin-left: 4px;
    }
`;

export const DrawToolWrapper = styled.div`
    display: none;
    
    ${props => props.drawTools && css`
        display: flex;
    `}
    
    #toggle-measurements {
        background: ${styles.colorMain};
        color: ${styles.colorFontLight};
        outline: none;

        &:hover {
            background: ${styles.colorMainDark};
            color: ${styles.colorFontLight};
        };
    };
    
    ${props => props.showMeasurements && css`
        #toggle-measurements {
            background: ${styles.colorMainDark};
        };
    `};
`;
