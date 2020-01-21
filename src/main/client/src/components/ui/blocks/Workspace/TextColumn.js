import styled, { css } from 'styled-components';
import * as styles from '../../defaultStyles';

const TextColumn = styled.div`
    flex-direction: column;
    flex: 7;
    overflow: hidden;
    
    &:hover {
        cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
        
        div:first-of-type {
            color: ${styles.colorMainDark};
            font-weight: bolder;
        }
    }
    
    ${props => props.userWorkspace && css`
        div:first-of-type {
            font-weight: bold;
        }
    
        div:last-of-type {
            font-size: 0.85em;
        }
    `};
    
    ${props => props.publicWorkspace && css`
        div {
            padding: 1rem;
            font-weight: bold;
        }
    `};
`;

export default TextColumn;
