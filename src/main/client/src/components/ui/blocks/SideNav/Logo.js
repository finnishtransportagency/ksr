import styled from 'styled-components';

const Logo = styled.div`
    height: 80px;
    width: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    img {
        height: 40px;
        width: 40px;
    }
    
    @media only screen and (max-width: 768px) {
        height: 60px;
    }
    
    &:hover {
        cursor: pointer;
    }
`;

export default Logo;
