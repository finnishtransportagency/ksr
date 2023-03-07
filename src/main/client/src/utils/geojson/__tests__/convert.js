// import { loadModules } from 'esri-loader';
import { project } from '../../projection';
import convert from '../convert';

// jest.mock('esri-loader');
// import Geometry from "@arcgis/core/geometry/Geometry";
jest.mock('@arcgis/core/geometry/Geometry');
jest.mock('@arcgis/core/geometry/Polygon');
jest.mock('../../projection');

class GeometryMock {
    constructor(params) {
        Object.entries(params).forEach(([key, value]) => {
            this[key] = value;
        });
    }
}

describe('geojson - convert', () => {
    beforeAll(() => {
        /* loadModules.mockResolvedValue([
            GeometryMock,
            GeometryMock,
            GeometryMock,
            GeometryMock,
        ]); */
        project.mockReturnValue([11, 22]);
    });

    it('test type=Point, no coordinate transform', async () => {
        const geometry = {
            type: 'Point',
            coordinates: [386378.77, 6672051.68],
        };
        const point = await convert(geometry, 3067, 3067);
        expect(point.x).toBeCloseTo(386378.77, 2);
        expect(point.y).toBeCloseTo(6672051.68, 2);
    });
    it('test type=Point, coordinate transform', async () => {
        const geometry = {
            type: 'Point',
            coordinates: [386378.77, 6672051.68],
        };
        const point = await convert(geometry, 3067, 4326);
        expect(point.x).toBeCloseTo(11, 2);
        expect(point.y).toBeCloseTo(22, 2);
    });

    it('test type=Polyline, no coordinate transform', async () => {
        const geometry = {
            type: 'Polyline',
            coordinates: [[386378, 6672051], [386379, 6672052], [386379, 6672052]],
        };

        const geom = await convert(geometry, 3067, 3067);
        expect(geom.paths).toMatchObject([
            [386378, 6672051], [386379, 6672052], [386379, 6672052],
        ]);
        expect(geom.spatialReference).toMatchObject({ wkid: 3067 });
    });

    it('test type=LineString, no coordinate transform', async () => {
        const geometry = {
            type: 'LineString',
            coordinates: [[386378, 6672051], [386379, 6672052], [386379, 6672052]],
        };

        const geom = await convert(geometry, 3067, 3067);
        expect(geom.paths).toMatchObject([
            [386378, 6672051], [386379, 6672052], [386379, 6672052],
        ]);
        expect(geom.spatialReference).toMatchObject({ wkid: 3067 });
    });

    it('test type=Polygon, no coordinate transform', async () => {
        const geometry = {
            type: 'Polygon',
            coordinates: [
                [386378, 6672051], [386379, 6672052], [386379, 6672052], [386378, 6672051],
            ],
        };

        const geom = await convert(geometry, 3067, 3067);
        expect(geom.rings).toMatchObject([
            [386378, 6672051], [386379, 6672052], [386379, 6672052], [386378, 6672051],
        ]);
        expect(geom.spatialReference).toMatchObject({ wkid: 3067 });
    });

    it('test type=MultiPoint, no coordinate transform', async () => {
        const geometry = {
            type: 'MultiPoint',
            coordinates: [
                [386378, 6672051], [386379, 6672052], [386379, 6672052],
            ],
        };

        const geom = await convert(geometry, 3067, 3067);
        expect(geom.points).toMatchObject([
            [386378, 6672051], [386379, 6672052], [386379, 6672052],
        ]);
        expect(geom.spatialReference).toMatchObject({ wkid: 3067 });
    });

    it('test unknown type', async () => {
        const geometry = {
            type: 'unknown',
            coordinates: [386378.77, 6672051.68],
        };
        const point = await convert(geometry, 3067, 4326);
        expect(point).toBe(null);
    });
});
