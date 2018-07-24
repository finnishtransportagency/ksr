import styled, { css } from 'styled-components';

export const DrawToolOuterWrapper = styled.div`
    display: flex;
    flex-direction: row-reverse;
    
    .esri-widget--button {
        margin-left: 4px;
    }
`;

export const DrawToolWrapper = styled.div`
    display: none;
    
    ${props => props.drawTools && css`
        display: flex;
    `}
`;
