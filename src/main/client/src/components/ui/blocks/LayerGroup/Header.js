import styled, { css } from 'styled-components';

const Header = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    
    &:hover {
        cursor: pointer;
    }
    
    .arrow-wrapper {
        outline: 0;
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        padding-right: 0.5rem;
    }
    
    ${props => props.subLayer && css`
        justify-content: flex-end;
        padding: unset;
        
        .toggle-arrow {
            margin: 0.5rem 0;
            outline: none;
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    `};
`;

export default Header;
