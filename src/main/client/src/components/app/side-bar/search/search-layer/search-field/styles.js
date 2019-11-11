import styled from 'styled-components';
import * as styles from '../../../../../ui/defaultStyles';

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
    flex: 3;
    margin-right: 0.5rem;
    
    .Select--single .Select-control {
        height: unset;
        border: 2px solid transparent;
    
        .Select-value {
            padding-left: 8px;
            padding-right: 8px;
        }
        
        .Select-arrow-zone {
            padding-right: 0;
        }
    }
`;

const Text = styled.div`
    flex: 6;
    
    .suggestion-outer-wrapper {
        position: relative;
    }
    
    .suggestion-inner-wrapper {
        background-color: ${styles.colorBackgroundWhite};
        position: absolute;
        z-index: 1;
        color: ${styles.colorFontDark};
        width: 100%;
        border: 1px solid ${styles.colorBackgroundGrey};
    }
    
    .suggestion {
        padding: 3px;
    }
    
    .suggestion.highlight {
        background-color: ${styles.colorMainDark};
    }
`;

SearchFieldWrapper.Title = Title;
SearchFieldWrapper.Remove = Remove;
SearchFieldWrapper.Inputs = Inputs;
SearchFieldWrapper.Expression = Expression;
SearchFieldWrapper.Text = Text;

export default SearchFieldWrapper;
