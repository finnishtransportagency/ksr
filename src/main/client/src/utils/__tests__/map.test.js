import { createGraphic } from '../map';
import { mapHighlightStroke as highlightStroke } from '../../components/ui/defaultStyles';

class GeometryHelper {
    constructor(spatialReference, type) {
        this.spatialReference = spatialReference;
        this.type = type;
    }

    clone() {
        return this;
    }
}

class GraphicHelper {
    constructor(graphic) {
        this.symbol = graphic.symbol;
        this.geometry = graphic.geometry;
    }
}

class SpatialReferenceHelper {
    constructor(srid) {
        this.wkid = srid;
    }
}

describe('map - createGraphic', () => {
    it('should generate Graphic for Point geometry', () => {
        const geometry = new GeometryHelper(null, 'point');

        const graphic = createGraphic(geometry, 3067, GraphicHelper, SpatialReferenceHelper);

        const expectedSymbol = {
            type: 'simple-marker',
            style: 'circle',
            size: 8,
            outline: {
                color: highlightStroke,
                width: 1,
            },
        };

        expect(graphic.symbol)
            .toEqual(expect.objectContaining(expectedSymbol));

        expect(graphic.geometry.type).toBe('point');
        expect(graphic.geometry.spatialReference.wkid).toBe(3067);
    });

    it('should generate Graphic for Polygon geometry', () => {
        const geometry = new GeometryHelper(null, 'polygon');

        const graphic = createGraphic(geometry, 3067, GraphicHelper, SpatialReferenceHelper);

        const expectedSymbol = {
            type: 'simple-fill',
            style: 'none',
            outline: {
                color: highlightStroke,
                width: 1,
            },
        };

        expect(graphic.symbol)
            .toEqual(expect.objectContaining(expectedSymbol));

        expect(graphic.geometry.type).toBe('polygon');
        expect(graphic.geometry.spatialReference.wkid).toBe(3067);
    });

    it('should generate Graphic for Polygon geometry', () => {
        const geometry = new GeometryHelper(null, 'polyline');

        const graphic = createGraphic(geometry, 3067, GraphicHelper, SpatialReferenceHelper);

        const expectedSymbol = {
            type: 'simple-line',
            style: 'solid',
            color: highlightStroke,
            width: 1,
        };

        expect(graphic.symbol)
            .toEqual(expect.objectContaining(expectedSymbol));

        expect(graphic.geometry.type).toBe('polyline');
        expect(graphic.geometry.spatialReference.wkid).toBe(3067);
    });

    it('should return null if no geometry or srid is defined', () => {
        expect(createGraphic(null, 3067, GraphicHelper, SpatialReferenceHelper)).toBe(null);
    });
});
