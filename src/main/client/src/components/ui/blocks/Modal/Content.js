import styled from 'styled-components';
import * as styles from '../../defaultStyles';

const Content = styled.div`
    position: relative;
    padding: ${props => (props.confirm ? '1rem' : '0 1rem')};
    background: #FFFFFF;
    height: auto;
    
    .Select-control, .Select.is-focused > .Select-control, .Select.is-focused:not(.is-open) > .Select-control {
        border-radius: 0;
        outline: none;
        border: 1px solid ${styles.colorBackgroundLightSecondary};
        background: ${styles.colorBackgroundLight};
        box-shadow: none;
        margin: 0.25rem 0 1rem;
    }
    
    .loading-icon {
        text-align: center;
    };
    
    @media only screen and (max-width: 768px) {
        max-height: 400px;
    };
`;

export default Content;
