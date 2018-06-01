export const mockWmsLayers = [
    {
        server: 'http://tiles.kartat.kapsi.fi',
        url: 'http://tiles.kartat.kapsi.fi/taustakartta?',
        copyright: 'maanmittauslaitos',
        sublayers: [
            {
                name: 'taustakartta',
            },
        ],
    },
    {
        server: 'https://julkinen.liikennevirasto.fi',
        url: 'https://julkinen.liikennevirasto.fi/inspirepalvelu/avoin/wms?',
        copyright: 'liikennevirasto',
        sublayers: [
            {
                name: 'rataverkko',
            },
        ],
    },
    {
        server: 'https://julkinen.liikennevirasto.fi',
        url: 'https://julkinen.liikennevirasto.fi/inspirepalvelu/avoin/wms?',
        copyright: 'liikennevirasto',
        sublayers: [
            {
                name: 'tasoristeykset',
            },
        ],
    },
];
