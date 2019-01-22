import styled, { css } from 'styled-components';

const Header = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 1rem;
    
    &:hover {
        cursor: pointer;
    }
    
    ${props => props.subLayer && css`
        justify-content: flex-end;
        padding: unset;
        
        div {
            display: block;
            margin: 0.5rem 0;
        }
    `};
`;

export default Header;
