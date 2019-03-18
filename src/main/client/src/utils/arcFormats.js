// @flow

type Graphic = {
    attributes: any,
    geometry: any,
    layer: any,
    popupTemplate: any,
    symbol: any,
    clone: () => any,
    getAttribute: (string) => any,
    setAttribute: (string, any) => any
};

const featureFromGraphic = (graphic: Graphic) => (
    {
        attributes: { ...graphic.attributes },
        geometry: graphic.geometry,
    }
);

const sourceFromGraphic = (graphic: Graphic) => {
    if (graphic.layer.featureType === 'shapefile') return graphic.layer.featureType;
    if (graphic.layer.id.includes('.s')) return 'search';
    return 'select';
};

const layerFromGraphic = (graphic: Graphic) => (
    {
        id: graphic.layer.id,
        title: graphic.layer.title,
        objectIdFieldName: graphic.layer.objectIdField,
        globalIdFieldName: '',
        geometryType: graphic.layer.geometryType,
        _source: sourceFromGraphic(graphic),
        spatialReference: {
            wkid: graphic.layer.spatialReference.wkid,
            latestWkid: graphic.layer.spatialReference.latestWkid,
        },
        fields: graphic.layer.fields.map(f => ({
            name: f.name,
            type: f.type,
            alias: f.alias,
            sqlType: f.sqlType,
            domain: f.domain,
            defaultValue: f.defaultValue,
            editable: f.editable,
            nullable: f.nullable,
            length: f.length,
        })),
        features: [
            featureFromGraphic(graphic),
        ],
    }
);

export const graphicsToEsriJSON = (graphics: Graphic[]) => {
    const layers = [];

    graphics.forEach((graphic) => {
        const matchingLayers = layers.filter(l => l.id === graphic.layer.id);

        if (matchingLayers.length === 0) {
            layers.push(layerFromGraphic(graphic)); // Create a new Layer
        } else {
            layers[0].features.push(featureFromGraphic(graphic)); // Add feature to existing Layer.
        }
    });

    return { layers };
};
