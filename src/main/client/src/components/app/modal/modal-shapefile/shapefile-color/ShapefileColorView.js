// @flow
import React, { Fragment } from 'react';
import { ColorRow, Color, ColorInput } from './styles';
import { H2 } from '../../../../ui/elements';
import strings from '../../../../../translations';

type Props = {
    color: ?string,
    setColor: (string) => void,
};

const colors = ['#e55934', '#17183b', '#ec4067', '#8cb369', '#05b2dc'];

function ShapefileColorView({ color, setColor }: Props): React$Element<React$FragmentType> {
    return (
        <>
            <H2>{strings.shapefileColorView.title}</H2>
            <ColorRow>
                {
                    colors.map(c => (
                        <Color
                            color={c}
                            key={c}
                            selected={c === color}
                            title={strings.shapefileColorView.selectTitle}
                            onClick={() => setColor(c)}
                            onKeyPress={() => setColor(c)}
                        />
                    ))
                }
            </ColorRow>
            <H2>{strings.shapefileColorView.titleCustomColor}</H2>
            <ColorRow>
                <ColorInput
                    type="color"
                    title={strings.shapefileColorView.customTitle}
                    selected={color && !colors.includes(color)}
                    onInput={evt => setColor(evt.target.value)}
                    onChange={evt => setColor(evt.target.value)}
                    value={(!colors.includes(color) && color) || '#000000'}
                />
            </ColorRow>
        </>
    );
}

export default ShapefileColorView;
