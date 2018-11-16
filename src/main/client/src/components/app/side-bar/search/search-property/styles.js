import styled from 'styled-components';
import * as styles from '../../../../ui/defaultStyles';

export const PropertyFeature = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 1rem 0;
    
    span {
        max-width: 50%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    
    a {
        color: ${styles.colorMain};
        text-decoration: none;
        margin-bottom: 0.5rem;
        
        &:hover {
            text-decoration: underline;
        }
    }
`;
