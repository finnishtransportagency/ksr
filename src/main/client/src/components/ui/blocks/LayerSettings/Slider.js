import styled from 'styled-components';
import * as styles from '../../defaultStyles';

const Slider = styled.div`
    padding-top: 1rem;
    
    .rc-slider {
        .rc-slider-track {
            background: ${styles.colorMain};
        }
        
        .rc-slider-rail {
            background: ${styles.colorBackgroundDark};
        }
        
        .rc-slider-handle {
            border: 2px solid ${styles.colorBackgroundDark};
            background: ${styles.colorBackgroundLight};
        }
    }
`;

export default Slider;
