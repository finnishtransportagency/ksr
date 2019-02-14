import styled from 'styled-components';
import * as styles from '../../defaultStyles';

const Loading = styled.div`
    display: flex;
    flex: 2;
    position: relative;
    
    .loading-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        margin: 0;
        bottom: 20px;
        background: ${styles.colorBackgroundLight};
        opacity: 0.9;
        z-index: 1;
    }
`;

export default Loading;
