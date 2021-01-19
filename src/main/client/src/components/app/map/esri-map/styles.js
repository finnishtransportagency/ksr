import styled, { css } from 'styled-components';
import * as styles from '../../../ui/defaultStyles';

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
        
        .esri-widget {
            font-family: 'Exo 2', Arial, sans-serif;
        };
        
        .esri-scale-bar {
            margin-bottom: 2rem;
        };
        
        .esri-ui-bottom-right {
            flex-flow: column-reverse;
        };
        
        .esri-ui {
            z-index: 2;
        }
        
        .esri-legend--card {
            bottom: 10px;
        }
        
        .esri-coordinate-conversion {
            margin-bottom: 3em;
        };
        
        .esri-coordinate-conversion__select-row {
            flex-basis: 110px;
        };
        
        .esri-attribution {
            margin-left: 120px;
        };
        
        .esri-feature__text {
            color: ${styles.colorBackgroundGrey};
            padding: 0 7px 1rem 0;
        }
        
        .esri-view-surface:focus, .esri-view-surface--inset-outline:focus::after,
        .esri-popup__button, .esri-popup__header-container, .esri-attribution__sources,
        .esri-popup__feature-menu-item, .esri-legend--card__carousel-indicator,
        .esri-coordinate-conversion__row, .esri-coordinate-conversion__select-row,
        .esri-coordinate-conversion__display, .esri-coordinate-conversion__mode-toggle,
        .esri-coordinate-conversion__row-button {
            outline: none;
        };
        
        #select-tool-outer-wrapper,
        #create-new-feature-wrapper,
        #draw-tool-outer-wrapper,
        #toggle-select-tools,
        #draw-rectangle,
        #draw-polygon-select,
        #draw-circle,
        #draw-create-new-feature,
        #accept-create-new-feature,
        #reject-create-new-feature,        
        #redo-new-feature,
        #undo-new-feature,
        #remove-selection {
            display: inline-flex;
        };
        
        #draw-rectangle {
            margin-right: 4px;
        };
        
        #draw-circle, #accept-create-new-feature {
            margin-left: 4px;
        };
        
        #toggle-select-tools,
        #toggle-draw-tools,
        #draw-create-new-feature,
        #undo-new-feature {
            margin-left: 10px;
        };
        
        #select-tool-wrapper {
            margin-left: 4px;
        }
        
        #remove-selection,
        #reject-create-new-feature {
            visibility: hidden;
            position: relative;
        };
                
        .esri-track,
        .esri-locate,
        .esri-compass,
        .esri-zoom .esri-interactive,
        .esri-disabled,
        #draw-erase,
        #draw-polygon,
        #draw-line,
        #draw-point,
        #draw-text,
        #toggle-select-tools,
        #toggle-draw-tools,
        #draw-rectangle,
        #draw-polygon-select,
        #draw-circle,
        #remove-draw,
        #draw-create-new-feature,
        #reject-create-new-feature,
        #accept-create-new-feature,
        #redo-new-feature,
        #undo-new-feature,
        #remove-selection {
            background: ${styles.colorMain};
            color: ${styles.colorFontLight};
            outline: none;
    
            &:hover {
                background: ${styles.colorMainDark};
                color: ${styles.colorFontLight};
            };
            
            &.disabled {
                pointer-events: none;
                cursor: default;
                opacity: 0.5;
                background: ${styles.colorFontDisabled};
            };
        };
        
        .esri-popup__feature-buttons {
            padding: 0 1em;
        };
        
        ${props => props.sideBar && css`
            left: 460px;
            width: calc(100% - 460px);
        `};
        
        ${props => props.tableOpen && css`
            height: 50%;
            
            @media only screen and (max-width: 768px) {
                height: 100%;
            };
        `};

        ${props => props.tableOpen && css`
            // Button width multiplied by number of buttons
            .esri-attribution {
                margin-left: calc(60px * ${props.tableButtonAmount});
            };
        `};

        ${props => props.layerLegendActive && props.tableOpen && css`
            .esri-coordinate-conversion, .esri-legend--stacked {
                right: 45px;
            };
        `};

        @media only screen and (max-width: 768px) {
            left: 0;
            width: 100%;
            
            .esri-ui-bottom-left {
                bottom: 2rem;
            };
            
            .esri-scale-bar, .esri-attribution {
                bottom: 60px;
                margin-left: 0;
                margin-right: 60px;
            };
            
            .esri-coordinate-conversion {
                bottom: 60px;
            };
            
            .esri-scale-bar {
                margin-bottom: calc(60px + 1em);
            };
            
            .esri-legend--stacked {
                margin-right: 45px;
                margin-bottom: 81px;
                min-width: 200px;
            };
            
            .esri-legend--card__section {
                min-width: 200px;
            };
        };
        
        @media only screen and (max-height: 735px) {
            .esri-coordinate-conversion, .esri-legend--stacked {
                right: 0; 
             }
            ${props => (props.indexMapActive || props.layerLegendActive) && css`
                @media only screen and (min-height: 486px) and (min-width: 486px) {
                    .esri-coordinate-conversion, .esri-legend--stacked {
                        right: 45px;
                    }
                }
            `};
        };
    };
        
    #extentDiv {
        background-color: rgba(0, 0, 0, 0.5);
        position: absolute;
        z-index: 2;
        visibility: visible;
    }
      
    #overView {
        position: absolute;
        bottom: 7.7rem;
        right: 16px;
        width: 300px;
        height: 200px;
        border: 1px solid ${styles.colorFontDark};
        z-index: 1;
        overflow: hidden;
        visibility: visible;
        
        ${props => !props.indexMapActive && css` 
            visibility: hidden;
        `};
        
        ${props => props.indexMapActive && props.tableOpen && css`
            right: 60px;
        `};
   
        ${props => props.indexMapActive && props.layerLegendActive && css`
            right: 20rem;
        `};

        @media only screen and (max-width: 735px) {
        ${props => props.indexMapActive && css`
            width: 200px;
            height: 150px;
            bottom: 7.7rem;
            right: 60px;
        `};

        ${props => props.indexMapActive && props.layerLegendActive && css`
            bottom: 25.5rem;
        `};
        }

        @media only screen and (max-height: 735px) {
            right: 60px;
        ${props => props.indexMapActive && props.layerLegendActive && css`
            @media only screen and (min-height: 486px) and (min-width: 486px) {
                right: 23rem;
                bottom: 7.7rem;
            }
            @media only screen and (max-height: 485px) and (min-width: 486px) {
                right: 16.5rem;
                bottom: 7.7rem;
            }
        `};
        };
    }

        ${props => props.loading && css`
            visibility: visible;
            background: ${styles.colorBackgroundLight};
            position: absolute;
            width: calc(100% - 60px);
            height: 100%;
            left: 60px;
            align-items: center;
            display: flex;
            justify-content: center;
            
            @media only screen and (max-width: 768px) {
                width: 100%;
                height: calc(100% - 60px);
                left: 0;
            }
        `};
    };
`;
