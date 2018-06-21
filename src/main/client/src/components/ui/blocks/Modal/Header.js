import styled from 'styled-components';

const Header = styled.div`
    position: relative;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    
    button {
        background: none;
        border: none;
        
        &:hover {
            cursor: pointer;
        }
        
        &:focus {
            outline: none;
        }
    }
`;

export default Header;
