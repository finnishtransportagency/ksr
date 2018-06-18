import styled, { css } from 'styled-components';
import * as styles from '../../ui/defaultStyles';

export const Wrapper = styled.div`
    #mapView {
        position: fixed;
        top: 0;
        left: 60px;
        z-index: -1;
        background: #ffffff;
        width: calc(100% - 60px);
        transition: 0.3s;
        height: 100%;
        
        ${props => props.sideBar && css`
            left: 460px;
            width: calc(100% - 460px);
        `};
        
         ${props => props.toggleTable && css`
            height: calc(100% - 400px);
        `};
        
        .esri-scale-bar, .esri-attribution {
            margin-left: 60px;
        }
        
        @media only screen and (max-width: 768px) {
            left: 0;
            width: 100%;
            
            .esri-ui-bottom-left {
                bottom: 2rem;
            }
            
            .esri-scale-bar, .esri-attribution {
            bottom: 60px;
            margin-left: 0;
            margin-right: 60px;
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
    .esri-locate,
    .esri-zoom .esri-interactive,
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
