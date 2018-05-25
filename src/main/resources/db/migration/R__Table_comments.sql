-- Comments for tables and columns

comment on table layer_group is 'Layer groups.';
comment on column layer_group.id is 'Generated layer group identifier. Primary key.';
comment on column layer_group.name is 'Name of the layer group.';
comment on column layer_group.group_order is 'Order of the layer groups.';

comment on table layer is 'Layer details.';
comment on column layer.id is 'Generated layer identifier. Primary key.';
comment on column layer.name is 'Name of the layer.';
comment on column layer.type is 'Type of the layer. Either wms, wfs, mvt, wmts or agfs (= ArcGIS Feature Service).';
comment on column layer.url is 'Url of the service where the layer is fetched from.';
comment on column layer.layers is 'Comma separated string of layers which are used from the service.';
comment on column layer.styles is 'JSON formatted string of styles for the layers.';
comment on column layer.visible is 'Whether the layer is visible or not.';
comment on column layer.opacity is 'Opacity of the layer.';
comment on column layer.authentication is 'AES256 encrypted Base64 encoded authentication string or null if the layer does not need authentication.';
comment on column layer.layer_order is 'Order of the layers.';
comment on column layer.min_zoom is 'Minimum zoom level for the layer.';
comment on column layer.max_zoom is 'Maximum zoom level for the layer.';
comment on column layer.layer_group_id is 'Identifier of the layer group that the layer belongs to.';
