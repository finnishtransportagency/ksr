import styled from 'styled-components';

const Footer = styled.div`
    display: flex;
    flex-direction: row-reverse;
    position: relative;
    padding: 1rem;
    
    @media only screen and (max-width: 768px) {
        flex-direction: column;
        
        button {
            align-self: stretch;
        }
    }
`;

export default Footer;
