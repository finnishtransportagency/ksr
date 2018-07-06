import styled from 'styled-components';

const Content = styled.div`
    height: 100%;
    
    .sidebar-content-scroll-wrapper {
        height: calc(100% - 80px) !important;
    }
    
    .sidebar-content-scroll-inner {
        padding: 0 1rem;
    }
    
    .sidebar-content-scroll-thumb {
        cursor: pointer;
        border-radius: inherit;
        background-color: rgba(255, 255, 255, 0.4);
    }
    
    .layer-view-scroll-wrapper {
        height: calc(100% - 160px) !important;
    }
`;

export default Content;
