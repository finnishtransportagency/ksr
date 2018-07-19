import styled, { css } from 'styled-components';

const SelectToolWrapper = styled.div`
    display: none;
 
    ${props => props.toggleTools && css`
        display: block;
    `};
`;

export default SelectToolWrapper;
