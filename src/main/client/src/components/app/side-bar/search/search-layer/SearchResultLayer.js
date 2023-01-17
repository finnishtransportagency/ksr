// @flow
import React from 'react';
import { StyledSearchResultLayer } from './styles';

type Props = {
    title: string,
    id: string,
    onClick: Function,
};

function SearchResultLayer({ title, id, onClick }: Props) {
    return (
        <StyledSearchResultLayer
            tabIndex="0"
            role="button"
            onClick={() => onClick(id)}
            onKeyPress={() => onClick(id)}
        >
            <div>
                <i className="fas fa-search-plus" />
            </div>
            <div>
                {title}
            </div>
        </StyledSearchResultLayer>
    );
}

export default SearchResultLayer;
