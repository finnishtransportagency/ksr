import styled from 'styled-components';

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 1rem 1rem 0;
    align-items: center;
    
    h2 {
        margin: 0;
    }
    
    .search-suggestions-toggle {
        outline: none;
        cursor: pointer;
        
        i {
            margin-left: 1rem;
        }
    }
`;

export default Header;
