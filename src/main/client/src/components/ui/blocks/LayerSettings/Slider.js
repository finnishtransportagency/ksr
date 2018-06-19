import styled from 'styled-components';
import * as styles from '../../defaultStyles';

const Slider = styled.div`
    padding-top: 1rem;
    
    .rc-slider {
        cursor: default;
    
        .rc-slider-track {
            background: ${styles.colorMain};
            cursor: default;
        }
        
        .rc-slider-rail {
            background: ${styles.colorBackgroundDark};
            cursor: default;
        }
        
        .rc-slider-handle {
            border: 2px solid ${styles.colorBackgroundDark};
            background: ${styles.colorBackgroundLight};
            cursor: default;
        }
    }
`;

export default Slider;
