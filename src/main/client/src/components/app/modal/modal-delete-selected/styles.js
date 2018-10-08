import styled from 'styled-components';
import * as styles from '../../../ui/defaultStyles';

export const TextArea = styled.textarea`
    min-width: 100%;
    max-width: 100%;
    min-height: 4rem;
    box-sizing: border-box;
    padding: 0.5rem;
    border: 1px solid ${styles.colorBackgroundGrey};
    
    &:focus {
        outline: none;
        border: 1px solid ${styles.colorMain};
    };
`;

export const FilteredDataTable = styled.table`
    text-align: left;
    display: block;
    
    th, td {
        padding-right: 1rem;
    }
    
    th:last-of-type, td:last-of-type {
        padding: 0;
    }
`;
