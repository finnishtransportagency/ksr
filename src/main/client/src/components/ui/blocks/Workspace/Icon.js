import styled from 'styled-components';
import * as styles from '../../defaultStyles';

const Icon = styled.div`
    padding: 1.5rem 0.5rem;
    text-align: center;
    align-self: center;
    flex: 1;
    
    &:hover {
        cursor: pointer;
        color: ${styles.colorBackgroundDarkBlue};
    }
`;

export default Icon;
