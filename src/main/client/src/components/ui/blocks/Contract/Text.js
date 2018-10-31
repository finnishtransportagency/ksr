import styled from 'styled-components';

const Text = styled.span`
    padding: 0 1rem;
    overflow: hidden;
    
    :first-of-type {
        width: 70px;
        min-width: 70px;
        text-overflow: clip;
    }
    
    :last-of-type {
        text-overflow: ellipsis;
    }
`;

export default Text;
