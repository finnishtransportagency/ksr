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
        
        .esri-scale-bar {
            margin-bottom: 2em;
        };
        
        .esri-attribution {
            margin-left: 60px;
        };
        
        .esri-view-surface:focus, .esri-view-surface--inset-outline:focus::after,
        .esri-popup__button, .esri-popup__header-container, .esri-attribution__sources,
        .esri-popup__feature-menu-item, .esri-legend--card__carousel-indicator {
            outline: none;
        };
        
        #select-tool-outer-wrapper,
        #create-new-feature-wrapper,
        #measure-tool-outer-wrapper,
        #draw-tool-outer-wrapper,
        #toggle-select-tools,
        #draw-rectangle,
        #draw-polygon-select,
        #draw-circle,
        #draw-create-new-feature,
        #accept-create-new-feature,
        #reject-create-new-feature,        
        #remove-selection {
            display: inline-flex;
        };
        
        #draw-rectangle
         {
            margin-right: 4px;
        };
        
        #draw-circle,
         #accept-create-new-feature {
            margin-left: 4px;
        };
        
        #toggle-select-tools,
        #toggle-measure-tools,
        #toggle-draw-tools,
        #draw-create-new-feature
         {
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
        #draw-measure-polygon,
        #draw-measure-line,
        #draw-erase,
        #draw-polygon,
        #draw-line,
        #draw-point,
        #draw-text,
        #toggle-select-tools,
        #toggle-measure-tools,
        #toggle-draw-tools,
        #draw-rectangle,
        #draw-polygon-select,
        #draw-circle,
        #remove-measurement,
        #remove-draw,
        #draw-create-new-feature,
        #reject-create-new-feature,
        #accept-create-new-feature,
        #remove-selection {
            background: ${styles.colorMain};
            color: ${styles.colorFontLight};
            outline: none;
    
            &:hover {
                background: ${styles.colorMainDark};
                color: ${styles.colorFontLight};
            };
        };
        
        .esri-popup__feature-buttons {
            padding: 0 1em;
        }
        
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

        ${props => props.tableOpen && !props.adminToolActive && css`
            // Button width multiplied by number of buttons
            .esri-attribution {
                margin-left: calc(60px * 5);
            };
        `};
        
        ${props => props.tableOpen && props.adminToolActive && css`
            // Button width multiplied by number of buttons
            .esri-attribution {
                margin-left: calc(60px * 7);
            };
        `};
        
        .esri-legend--card {
            bottom: 60px;
        }

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
            
            .esri-scale-bar {
                margin-bottom: calc(60px + 1em);
            };
            
            .esri-legend--stacked {
                margin-right: 60px;
                margin-bottom: 120px;
                min-width: 200px;
            };
            
            .esri-legend--card__section {
                min-width: 200px;
            };
        };
    };
    
    .loading-icon {
        visibility: hidden;
        
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
