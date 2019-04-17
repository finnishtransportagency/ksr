import styled, { css } from 'styled-components';
import * as styles from '../../defaultStyles';

import Content from './Content';
import ContentTop from './ContentTop';
import ContentMain from './ContentMain';
import Slider from './Slider';

const LayerSettings = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 0 1rem;
    
    ${props => props.toggledHidden && css`
        opacity: 0.5;
    `}
`;

const Icons = styled.div`
    flex: 1;
    text-align: right;
    
    ${props => props.activeAdminTool && css`
        color: ${styles.colorDanger};
    `}
    
    i:hover {
        cursor: pointer;
    }
    
    .theme-layer-created {
        color: ${styles.colorDanger};
    }
`;

const Icon = styled.i`
    visibility: visible;
    
    ${props => props.hidden && css`
            visibility: hidden;
         `}
`;

const Drag = styled.div`
    flex: 1;
    align-self: center;
    text-align: center;
`;

const Title = styled.div`
    flex: 8;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const Toggle = styled.div`
    display: flex;
    align-self: center;
    padding: 0 1rem;
    flex-direction: column;
    justify-content: space-around;
    height: 75%;
    
    .symbolWrapper {
        align-self: center;
        max-width: 1em;
    };

    ${props => !props.viewable && css`
        cursor: grab;
    `}

    ${props => props.viewable && css`
        cursor: pointer;
    `}
`;

LayerSettings.Content = Content;
LayerSettings.Drag = Drag;
LayerSettings.Icons = Icons;
LayerSettings.Icon = Icon;
LayerSettings.Slider = Slider;
LayerSettings.Title = Title;
LayerSettings.Toggle = Toggle;
LayerSettings.ContentTop = ContentTop;
LayerSettings.ContentMain = ContentMain;

export default LayerSettings;
