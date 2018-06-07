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
        `};
        
        @media only screen and (max-width: 768px) {
            left: 0;
            width: 100%;
            
            .esri-ui-bottom-left {
                bottom: 2rem;
            }
        };
        
        .esri-view-surface:focus, .esri-view-surface--inset-outline:focus::after,
        .esri-popup__button, .esri-popup__header-title {
            outline: none;
        }
    
        .esri-popup--is-docked-top-right {
            margin-right: 60px;
        }
        
        .esri-popup--is-docked-bottom-center {
            margin-bottom: 60px;
        }
    }
    
    .esri-track,
    .esri-zoom .esri-interactive,
    .esri-home,
    #draw-polygon,
    #draw-line {
        background: ${styles.colorMain};
        color: ${styles.colorFontLight};
        outline: none;

        &:hover {
            background: ${styles.colorMainHighlight};
            color: ${styles.colorFontLight};
        }
    }
`;
