import styled, { css } from 'styled-components';

export const MapLayerTitleWrapper = styled.div`
    display: flex;
    
    ${props => props.showLayerGroup && css`
        font-size: 14px;
        padding: 0 0 0.2em 0;
    `};  
    
    ${props => props.childLayer && css`
        min-height: 6px;
    `};
    
    ${props => props.color && css`
        color: ${props.color};
    `};
`;

export const Icon = styled.div`
    min-width: 1rem;
    max-width: 1rem;
    margin-right: 0.5rem;
    
    i {
      font-size: 0.8rem;
    }
`;

export const Text = styled.div`
    overflow: hidden;
    -ms-text-overflow: ellipsis;
    text-overflow: ellipsis;
`;

export const TooltipChildrenWrapper = styled.div`
    overflow-y: scroll;
    max-height: 400px;
`;
