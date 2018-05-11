import styled, { css } from 'styled-components';
import * as styles from '../../defaultStyles';

const Link = styled.div`
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    height: 60px;
    width: 60px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25em;
    
    &:hover {
        cursor: pointer;
        border-left: 5px solid ${styles.colorMainHighlight};
    };
    
    ${props => props.active && css`
        border-left: 5px solid ${styles.colorMain};
    `}
`;

export default Link;
