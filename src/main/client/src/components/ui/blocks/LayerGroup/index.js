import styled, { css } from 'styled-components';
import * as styles from '../../defaultStyles';

import Header from './Header';
import Content from './Content';
import Layer from './Layer';
import Label from './Label';
import RemoveIcon from './RemoveIcon';
import Span from './Span';

const LayerGroup = styled.div`
    background: ${styles.colorBackgroundLight};
    color: ${styles.colorFontDark};
    display: flex;
    flex-direction: column;
    transition: 0.3s;
    -webkit-box-shadow: ${styles.shadowDefault};
    -moz-box-shadow: ${styles.shadowDefault};
    box-shadow: ${styles.shadowDefault};
    border-left: 5px solid transparent;
    user-select: none;
    margin: 1rem;
    
    label:hover {
        cursor: pointer;
    }
    
    ${props => props.active && css`
        border-left: 5px solid ${styles.colorMain};
    `};
`;

LayerGroup.Header = Header;
LayerGroup.Content = Content;
LayerGroup.Layer = Layer;
LayerGroup.Layer.Label = Label;
LayerGroup.Layer.RemoveIcon = RemoveIcon;
LayerGroup.Span = Span;

export default LayerGroup;
