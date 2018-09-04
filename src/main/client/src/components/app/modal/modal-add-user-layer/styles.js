import styled from 'styled-components';
import * as styles from '../../../ui/defaultStyles';

export const SliderWrapper = styled.div`
    .rc-slider {
        cursor: default;
        margin: 1rem 0.5rem;
        width: calc(100% - 1rem);
    
        .rc-slider-track {
            background: ${styles.colorMain};
        }
        
        .rc-slider-rail {
            background: ${styles.colorBackgroundLight};
            cursor: default;
        }
        
        .rc-slider-handle {
            border: 2px solid ${styles.colorMain};
            background: ${styles.colorBackgroundLight};
            cursor: default;
        }
    }
`;
