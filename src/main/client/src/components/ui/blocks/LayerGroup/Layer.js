import styled from 'styled-components';
import * as styles from '../../defaultStyles';

const Layer = styled.div`
    display: flex;
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
`;

export default Layer;
