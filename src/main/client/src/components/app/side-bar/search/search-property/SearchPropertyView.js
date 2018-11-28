// @flow
import React, { Fragment } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import 'react-select/dist/react-select.css';
import Property from '../../../../ui/blocks/Property';
import LoadingIcon from '../../../shared/LoadingIcon';
import PropertyInfoView from './property-info/PropertyInfoView';
import PropertyPrintFilesView from './property-print-files/PropertyPrintFilesView';

type Props = {
    features: Object[],
    fetching: boolean,
    handlePropertyClick: (id: string) => void,
    activeProperty: string,
};

const SearchPropertyView = ({
    features,
    fetching,
    handlePropertyClick,
    activeProperty,
}: Props) => (
    <Scrollbars
        autoHide
        className="sidebar-content-scroll-wrapper"
        renderView={scrollProps =>
            <div {...scrollProps} className="sidebar-content-scroll-inner" />}
        renderThumbVertical={scrollProps =>
            <div {...scrollProps} className="sidebar-content-scroll-thumb" />}
    >
        {fetching && <LoadingIcon loading={fetching} />}
        {features.length > 0 &&
            <Fragment>
                {features.map(feature =>
                    (
                        <Property active={activeProperty === feature.id} key={feature.id}>
                            <Property.Header onClick={() => handlePropertyClick(feature.id)}>
                                <div>
                                    <span>{feature.id}</span>
                                </div>
                                <div>
                                    <i
                                        className={
                                            activeProperty === feature.id
                                                ? 'fas fa-chevron-up'
                                                : 'fas fa-chevron-down'
                                        }
                                    />
                                </div>
                            </Property.Header>
                            <Property.Content hidden={activeProperty !== feature.id}>
                                <PropertyInfoView properties={feature.properties} />
                                <br />
                                <PropertyPrintFilesView
                                    links={feature.links}
                                    fetching={feature.fetchingLinks}
                                />
                            </Property.Content>
                        </Property>
                    ))}
            </Fragment>
        }
    </Scrollbars>
);

export default SearchPropertyView;
