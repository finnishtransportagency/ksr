import styled, { css } from 'styled-components';

const ContentMain = styled.div`
    display: flex;
    flex: 8;
    justify-content: space-between;
    flex-direction: column;
    width: 100%;
    padding: 1rem;
    overflow: hidden;
    
    ${props => props.childLayer && css`
        padding: 0.5rem 0.5rem 0.5rem 1rem;
    `}
`;

export default ContentMain;
