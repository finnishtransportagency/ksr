import styled, { css } from 'styled-components';

const ButtonWrapper = styled.div`
    position: relative;
    height: 60px;
    display: inline-flex;
    z-index: 1;
    bottom: 60px;
    left: 0;
    
    ${props => props.tableOpen && css`
        position: relative;
        bottom: 60px;
        left: 0;
    `};
    
    @media only screen and (max-width: 768px) {
        position: fixed;
        right: 0;
        bottom: 60px;
        top: unset;
        flex-direction: row-reverse;
        
        ${props => props.tableOpen && css`
            width: 100%;
            background: inherit;
        `};
    }
`;

export default ButtonWrapper;
