import styled from 'styled-components';
import * as styles from '../../../../../ui/defaultStyles';

const Wrapper = styled.div`
     
    .draw-create-new-feature-disabled {
        pointer-events: none;
        cursor: default;
        opacity: 0.5;
        background: ${styles.colorFontDisabled};
    }
`;

export default Wrapper;
