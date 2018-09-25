import styled from 'styled-components';

export const Wrapper = styled.div`
    text-align: center;
    
    h1 {
        text-transform: uppercase;
    }
`;

export const LoadingWrapper = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: #444;
    z-index: 999;
    opacity: 0.75;
    display: flex;
    justify-content: center;
    align-items: center;
`;
