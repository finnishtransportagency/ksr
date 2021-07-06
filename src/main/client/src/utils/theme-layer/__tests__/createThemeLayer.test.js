import { resetLayerTheme } from '../createThemeLayer';
import { toggleLayerLegend } from '../../../reducers/map/actions';

jest.mock('../../../store');
jest.mock('../../../reducers/map/actions');

beforeEach(() => {
    toggleLayerLegend.mockClear();
});

describe('createThemeLayer', () => {
    it('resetLayerTheme - should reset layer\'s renderer to default', () => {
        const featureLayer = {
            renderer: 'themeRenderer',
            legendEnabled: true,
        };
        const layer = {
            renderer: 'defaultRenderer',
        };

        const expectedResult = {
            renderer: 'defaultRenderer',
            legendEnabled: false,
        };

        resetLayerTheme(featureLayer, layer, [{}], jest.fn);
        expect(featureLayer).toEqual(expectedResult);
    });

    it('should close legend popup if last legend is deactivated on resetLayerTheme call', () => {
        const featureLayer = {
            renderer: 'themeRenderer',
            legendEnabled: true,
        };
        const layer = {
            renderer: 'defaultRenderer',
            id: 1,
        };
        const otherLayer = {
            renderer: null,
            visible: true,
            id: 2,
        };
        resetLayerTheme(featureLayer, layer, [layer, otherLayer], jest.fn, true);
        expect(toggleLayerLegend).toBeCalledTimes(1);
    });

    it('should not close legend popup if there are active legends after resetting selected layer', () => {
        const featureLayer = {
            renderer: 'themeRenderer',
            legendEnabled: true,
        };
        const layer = {
            renderer: 'defaultRenderer',
            id: 1,
        };
        const otherLayer = {
            renderer: 'otherRenderer',
            visible: true,
            id: 2,
        };
        resetLayerTheme(featureLayer, layer, [layer, otherLayer], jest.fn, true);
        expect(toggleLayerLegend).not.toBeCalled();
    });
});
