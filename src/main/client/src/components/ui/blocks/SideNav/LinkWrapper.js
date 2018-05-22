import styled from 'styled-components';

const LinkWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: calc(100% - 80px);
    
    div {
        @media only screen and (max-width: 768px) {
            display: flex;
            flex-direction: row;
        }
    }
    
    @media only screen and (max-width: 768px) {
        flex-direction: row;
        height: auto;
    }
`;

export default LinkWrapper;
