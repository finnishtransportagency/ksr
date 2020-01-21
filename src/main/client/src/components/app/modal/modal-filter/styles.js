import styled from 'styled-components';

export const ModalFilterWrapper = styled.div`
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between; 
  
    &:after {
        content: "";
        width: 33%;
    }
`;

export const CheckboxWrapper = styled.div`
    width: 33%;
    display: inline-block;
    vertical-align: bottom;
    
    label p {
        overflow: hidden;
        text-overflow: ellipsis;
        margin: 0;
    }
    
    @media only screen and (max-width: 768px) {
        width: 100%;
    }
`;

export const Description = styled.p`
    padding: 0 1rem;
    margin-bottom: 2rem;
`;
