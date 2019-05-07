import { resetLayerTheme } from '../createThemeLayer';

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
});
