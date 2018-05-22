import styled, { css } from 'styled-components';
import * as styles from '../../ui/defaultStyles';

export const Wrapper = styled.div`
    #mapView {
        position: fixed;
        top: 0;
        left: 60px;
        z-index: -1;
        background: #ffffff;
        height: 100%;
        width: calc(100% - 60px);
        transition: 0.3s;
        
        ${props => props.sideBar && css`
            left: 360px;
            width: calc(100% - 360px);
        `}
    }
    
    .esri-locate,
    .esri-zoom .esri-interactive,
    .esri-home {
        background: ${styles.colorMain};
        color: ${styles.colorFontLight};

        &:hover {
            background: ${styles.colorMainHighlight};
            color: ${styles.colorFontLight};
        }
    }
`;
