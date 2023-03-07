// @flow
import React, { Fragment } from 'react';
import strings from '../../../../../../translations';
import { H2 } from '../../../../../ui/elements';
import LoadingIcon from '../../../../shared/LoadingIcon';
import { PropertyFeature } from '../styles';

type Props = {
    links: Object,
    fetching: boolean,
};

function PropertyPrintFilesView({ links, fetching }: Props): React$Element<React$FragmentType> {
    return (
        <>
            {fetching && <LoadingIcon loading={fetching} />}
            {links
            && (
                <>
                    <H2>{strings.searchProperty.propertyPrintFiles.title}</H2>
                    { links.registerunit && links.registerunit.map(url => (
                        <PropertyFeature key={url}>
                            <a rel="noopener noreferrer" target="_blank" href={url}><span>{strings.searchProperty.propertyPrintFiles.registerunit}</span></a>
                        </PropertyFeature>
                    ))}
                    { links.deed && links.deed.map(url => (
                        <PropertyFeature key={url}>
                            <a rel="noopener noreferrer" target="_blank" href={url}><span>{strings.searchProperty.propertyPrintFiles.deed}</span></a>
                        </PropertyFeature>
                    ))}
                    { links.easement && links.easement.map(url => (
                        <PropertyFeature key={url}>
                            <a rel="noopener noreferrer" target="_blank" href={url}><span>{strings.searchProperty.propertyPrintFiles.easement}</span></a>
                        </PropertyFeature>
                    ))}
                    { links.map && <p>{strings.searchProperty.propertyPrintFiles.maps}</p>}
                    { links.map && links.map.map((url, i) => (
                        <PropertyFeature key={(url)}>
                            <a rel="noopener noreferrer" target="_blank" href={url}>
                                <span>
                                    {strings.searchProperty.propertyPrintFiles.map}
                                    {' '}
                                    {i + 1}
                                </span>
                            </a>
                        </PropertyFeature>
                    ))}
                </>
            )}
        </>
    );
}

export default PropertyPrintFilesView;
