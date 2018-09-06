import styled, { css } from 'styled-components';

const Footer = styled.div`
    display: flex;
    flex-direction: row-reverse;
    position: relative;
    padding: 0.5rem 1rem;
    background: #FFFFFF;
    
    button {
        margin-left: 1em;
    }
    
    ${props => props.hidden && css`
        display: none;
    `}
    
    @media only screen and (max-width: 768px) {
        flex-direction: column;
        
        button {
            align-self: stretch;
            margin: 0.5rem 0;
        }
    }
`;

export default Footer;
