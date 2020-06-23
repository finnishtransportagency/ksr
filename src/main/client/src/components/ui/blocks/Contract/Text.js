import styled from 'styled-components';

const Text = styled.span`
    padding: 0 1rem;
    overflow: hidden;
    
    :first-of-type {
        width: 120px;
        min-width: 120px;
        text-overflow: ellipsis;
    }
    
    :last-of-type {
        text-overflow: ellipsis;
    }
`;

export default Text;
