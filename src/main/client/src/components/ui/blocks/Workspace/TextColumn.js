import styled from 'styled-components';
import * as styles from '../../defaultStyles';

const TextColumn = styled.div`
    flex-direction: column;
    flex: 7;
    overflow: hidden;
    
    &:hover {
        cursor: pointer;
        
        div:first-of-type {
            color: ${styles.colorBackgroundDarkBlue};
            font-weight: bolder;
        }
    }
    
    div:first-of-type {
        font-weight: bold;
    }
    
    div:last-of-type {
        font-size: 0.85em;
    }
`;

export default TextColumn;
