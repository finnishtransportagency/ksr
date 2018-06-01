import styled, { css } from 'styled-components';
import * as styles from '../../../ui/defaultStyles';

export const MeasurementBox = styled.div`
    position: absolute;
    right: 1rem;
    bottom: 2rem;
    background: ${styles.colorBackgroundDark};
    color: ${styles.colorFontLight};
    padding: 1rem;
    -webkit-box-shadow: ${styles.shadowLight};
    -moz-box-shadow: ${styles.shadowLight};
    box-shadow: ${styles.shadowLight};
    display: flex;
    justify-content: space-between;
    
    .fa-times {
        &:hover {
            cursor: pointer;
        }
    };
    
    .value-text {
        padding: 0 1rem;
    }
            
    ${props => props.hidden && css`
        display: none;
    `};
    
    @media only screen and (max-width: 768px) {
        bottom: 5rem;
    };
`;
