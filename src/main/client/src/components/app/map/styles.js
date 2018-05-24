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
        };
        
        #measurement {
            position: absolute;
            right: 1rem;
            bottom: 2rem;
            background: #FFFFFF;
            padding: 1rem;
            -webkit-box-shadow: ${styles.shadowDefault};
            -moz-box-shadow: ${styles.shadowDefault};
            box-shadow: ${styles.shadowDefault};
            
            @media only screen and (max-width: 768px) {
                bottom: 5rem;
            };
        }
    }
    
    .esri-track,
    .esri-zoom .esri-interactive,
    .esri-home,
    #draw-polygon,
    #draw-line {
        background: ${styles.colorMain};
        color: ${styles.colorFontLight};

        &:hover {
            background: ${styles.colorMainHighlight};
            color: ${styles.colorFontLight};
        }
    }
`;
