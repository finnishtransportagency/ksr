import styled, { css } from 'styled-components';

const Content = styled.div`
    padding: 0 1rem;
    
    ${props => props.layerSettings && css`
        padding: 0;
    `}
`;

export default Content;
