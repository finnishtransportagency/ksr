import { project } from '../index';

const coordsToFixed = (coords) => {
    if (Array.isArray(coords) && coords.length && coords.every(Number.isFinite)) {
        return coords.map(c => c.toFixed(2));
    }
    return coords.reduce((acc, cur) => [...acc, coordsToFixed(cur)], []);
};

describe('project', () => {
    it('should project a simple array from EPSG:4326 to EPSG:3067', () => {
        const coords = [24.952258587, 60.169515766];
        const result = coordsToFixed(project('EPSG:4326', 'EPSG:3067', coords));

        const expected = ['386378.77', '6672051.68'];
        expect(result).toMatchObject(expected);
    });

    it('should project a nested array from EPSG:4326 to EPSG:3067', () => {
        const coords = [[24.952258587, 60.169515766], [24.951395555, 60.167595804]];
        const result = coordsToFixed(project('EPSG:4326', 'EPSG:3067', coords));

        const expected = [['386378.77', '6672051.68'], ['386324.26', '6671839.40']];
        expect(result).toMatchObject(expected);
    });

    it('should project a MultiPolygon from EPSG:4326 to EPSG:3067', () => {
        const coords = [
            [
                [24.952258587, 60.169515766],
                [24.951395555, 60.167595804],
                [24.947594178, 60.167497981],
            ],
        ];
        const result = coordsToFixed(project('EPSG:4326', 'EPSG:3067', coords));

        const expected = [
            [['386378.77', '6672051.68'], ['386324.26', '6671839.40'], ['386113.04', '6671835.06']],
        ];
        expect(result).toMatchObject(expected);
    });
});
