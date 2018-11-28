import styled, { css } from 'styled-components';
import * as styles from '../../defaultStyles';

import Header from './Header';
import Content from './Content';

const Property = styled.div`
    background: ${styles.colorBackgroundLight};
    color: ${styles.colorFontDark};
    display: flex;
    flex-direction: column;
    transition: 0.3s;
    -webkit-box-shadow: ${styles.shadowDefault};
    -moz-box-shadow: ${styles.shadowDefault};
    box-shadow: ${styles.shadowDefault};
    border-left: 5px solid transparent;
    margin: 1rem 0;
    
    label:hover {
        cursor: pointer;
    }
    
    ${props => props.active && css`
        border-left: 5px solid ${styles.colorMain};
    `};
`;

Property.Header = Header;
Property.Content = Content;

export default Property;
