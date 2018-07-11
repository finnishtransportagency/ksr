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
        
         .esri-scale-bar, .esri-attribution {
            margin-left: 60px;
        }
        
         ${props => props.toggleTable && css`
            height: 50%;
            
            .esri-scale-bar, .esri-attribution {
                margin-left: 120px;
            }
        `};

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
            
            .esri-scale-bar {
                margin-bottom: 20px;
            }
        }
        
        .esri-view-surface:focus, .esri-view-surface--inset-outline:focus::after,
        .esri-popup__button, .esri-popup__header-title, .esri-attribution__sources {
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
    .esri-compass,
    .esri-zoom .esri-interactive,
    .esri-disabled,
    #draw-polygon,
    #draw-line,
    #toggle-select-tools,
    #draw-rectangle,
    #draw-polygon-select,
    #draw-circle,
    #remove-selection {
        background: ${styles.colorMain};
        color: ${styles.colorFontLight};
        outline: none;

        &:hover {
            background: ${styles.colorMainHighlight};
            color: ${styles.colorFontLight};
        }
    }
    
    #select-tool-outer-wrapper,
    #toggle-select-tools,
    #draw-rectangle,
    #draw-polygon-select,
    #draw-circle,
    #remove-selection {
        display: inline-flex;
    }
    
    #draw-rectangle {
        margin-right: 4px;
    }
    
    #draw-circle {
        margin-left: 4px;
    }
    
    #toggle-select-tools, #select-tool-wrapper {
        margin-left: 10px;
    }
    
    #remove-selection {
        visibility: hidden;
    }
`;
