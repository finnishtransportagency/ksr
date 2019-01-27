import styled, { css } from 'styled-components';
import * as styles from '../../defaultStyles';

const Content = styled.div`
    padding: 0 1rem 1rem;
    
    ${props => props.subLayer && css`
        padding: 0 1rem;
        position: relative;
        
        .loading-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            width: 100%;
            height: 100%;
            margin: 0;
            background: ${styles.colorBackgroundLight};
            opacity: 0.9;
            z-index: 1;
        }
    `};
    
    label {
        display: block;
        margin: 0.5rem 0;
    }
`;

export default Content;
