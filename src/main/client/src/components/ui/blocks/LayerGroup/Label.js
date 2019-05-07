import styled, { css } from 'styled-components';
import * as styles from '../../defaultStyles';

const Label = styled.label`
    flex: 9;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    
    ${({ subLayer }) => subLayer && css`
        position: relative;
        display: flex;
        margin: 0.5rem 0;
        
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
    `}
    
    ${props => props.failOnLoad && css`
        color: ${styles.colorDanger};
    `}
`;

export default Label;
