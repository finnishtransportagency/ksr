import styled, { css } from 'styled-components';

import Content from './Content';
import ContentTop from './ContentTop';
import ContentMain from './ContentMain';

const LayerSettings = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 0 1rem;
    
    ${props => props.toggledHidden && css`
        opacity: 0.5;
    `}
`;

const Icons = styled.div`
    flex: 2;
    text-align: right;
`;

const Drag = styled.div`
    flex: 1;
    align-self: center;
    text-align: center;
`;

const Slider = styled.div`
    padding-top: 1rem;
`;

const Title = styled.div`
    flex: 8;
`;

const Toggle = styled.div`
    align-self: center;
    padding: 1rem;
`;

LayerSettings.Content = Content;
LayerSettings.Drag = Drag;
LayerSettings.Icons = Icons;
LayerSettings.Slider = Slider;
LayerSettings.Title = Title;
LayerSettings.Toggle = Toggle;
LayerSettings.ContentTop = ContentTop;
LayerSettings.ContentMain = ContentMain;

export default LayerSettings;
