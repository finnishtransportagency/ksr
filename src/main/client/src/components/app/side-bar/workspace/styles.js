// eslint-disable-next-line no-irregular-whitespace
import styled, {  css } from 'styled-components';

export const WorkspaceWrapper = styled.div`
    padding: 0 1em;

    button {
        width: 100%;
    }
    
    .Select-control {
        border-radius: 0;
    }
`;

export const WorkspaceTitle = styled.p`
    font-weight: bold;
    
    ${props => props.extraPadding && css`
        padding-top: 1rem;
    `};
`;
