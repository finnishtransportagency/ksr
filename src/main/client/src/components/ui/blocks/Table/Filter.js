import styled, { css } from 'styled-components';
import * as styles from '../../defaultStyles';

const Filter = styled.div`
    background: ${styles.colorBackgroundDark};
    width: 60px;
    display: flex;
    flex-direction: column;
    position: relative;
    left: 60px;
    top: -60px;
    height: 60px;
    box-sizing: border-box;
    align-items: center;
    justify-content: center;
    font-size: 1.25em;
    transition: 0.3s;
    z-index: 1;
    
    &:hover {
        cursor: pointer;
        background: ${styles.colorBackgroundDarkSecondary};
    };
    
    ${props => props.toggleFilter && css`
        top: -120px;
        bottom: 0;
    `};
    
    @media only screen and (max-width: 768px) {
        position: fixed;
        top: unset;
        transform: unset;
        bottom: 0;
        left: unset;
        right: 60px;
    
        border-left: none;
        border-right: none;
        border-bottom: 5px solid transparent;
        border-top: 5px solid transparent;

        &:hover {
            cursor: pointer;
            background: ${styles.colorBackgroundDarkSecondary};
        };

        ${props => props.toggleFilter && css`
            bottom: calc(100% - 60px);
        `};
    }
`;

export default Filter;
