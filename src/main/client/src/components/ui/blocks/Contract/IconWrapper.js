import styled, { css } from 'styled-components';

const IconWrapper = styled.div`
    display: flex;
    flex: 0 0 auto;
    text-align: center;
    justify-content: center;
    align-items: center;
    
    ${({ wide }) => wide && css`
        justify-content: space-between;
        min-width: 70px;
    `};
`;

export default IconWrapper;
