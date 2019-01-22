import styled, { css } from 'styled-components';

const Content = styled.div`
    padding: 0 1rem 1rem;
    
    ${props => props.subLayer && css`
        padding: 0 1rem;
 `};
    
    label {
        display: block;
        margin: 0.5rem 0;
    }
`;

export default Content;
