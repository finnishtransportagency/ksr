import styled from 'styled-components';

const SearchFieldWrapper = styled.div``;

const Title = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 1rem 0;
`;

const Remove = styled.div`
    &:hover {
        cursor: pointer;
        color: #FFFFFF;
    }
    
    &:focus {
        outline: none;
    }
`;

const Inputs = styled.div`
    display: flex;
`;

const Expression = styled.div`
    flex: 1;
    margin-right: 0.5rem;
    
    .Select-control {
        height: unset;
        border: 2px solid transparent;
    }
`;

const Text = styled.div`
    flex: 6;
`;

SearchFieldWrapper.Title = Title;
SearchFieldWrapper.Remove = Remove;
SearchFieldWrapper.Inputs = Inputs;
SearchFieldWrapper.Expression = Expression;
SearchFieldWrapper.Text = Text;

export default SearchFieldWrapper;
