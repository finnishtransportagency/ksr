import styled from 'styled-components';
import * as styles from '../../defaultStyles';

const Content = styled.div`
    position: relative;
    padding: 1rem;
    background: #FFFFFF;
    
    .Select-control, .Select.is-focused > .Select-control, .Select.is-focused:not(.is-open) > .Select-control {
        border-radius: 0;
        outline: none;
        border: none;
        background: ${styles.colorBackgroundLight}
        box-shadow: none;
        margin: 0.25rem 0 1rem;
    }
    
    .loading-icon {
        text-align: center;
    };
`;

export default Content;
