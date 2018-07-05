import styled from 'styled-components';
import * as styles from '../../defaultStyles';

const Checkmark = styled.span`
    position: absolute;
    top: 0;
    left: 1rem;
    height: 1rem;
    width: 1rem;
    background-color: ${styles.colorBackgroundLightSecondary};
    box-shadow: ${styles.shadowInset};
    
    &:after {
        content: "";
        position: absolute;
        display: none;
        left: 5px;
        top: 2px;
        width: 3px;
        height: 7px;
        border: solid ${styles.colorBackgroundWhite};
        border-width: 0 3px 3px 0;
        -webkit-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        transform: rotate(45deg);
    }
`;

export default Checkmark;
