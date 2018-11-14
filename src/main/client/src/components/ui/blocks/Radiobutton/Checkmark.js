import styled from 'styled-components';
import * as styles from '../../defaultStyles';

const Checkmark = styled.span`
    position: absolute;
    top: 0;
    left: 0;
    height: 1rem;
    width: 1rem;
    background-color: ${styles.colorFontLight};
    border-radius: 50%;
    
    &:after {
        content: "";
        position: absolute;
        display: none;
    }
`;

export default Checkmark;
