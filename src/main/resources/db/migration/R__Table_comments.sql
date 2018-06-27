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
comment on column layer.opacity is 'Opacity of the layer.';
comment on column layer.authentication is 'AES256 encrypted Base64 encoded authentication string or null if the layer does not need authentication.';
comment on column layer.layer_order is 'Order of the layers.';
comment on column layer.min_scale is 'The minimum scale at which the layer is visible.';
comment on column layer.max_scale is 'The maximum scale at which the layer is visible.';
comment on column layer.layer_group_id is 'Identifier of the layer group that the layer belongs to.';
comment on column layer.transparent is 'Whether the layer is transparent or not.';
comment on column layer.attribution is 'Layer copyright information.';
comment on column layer.desktop_visible is 'Whether the layer is visible or not on desktop.';
comment on column layer.mobile_visible is 'Whether the layer is visible or not on mobile.';
comment on column layer.queryable is 'Whether the layer can be queried or not.';
comment on column layer.query_columns is 'Columns which are used in free word query.';

comment on table layer_permission is 'Layer permissions.';
comment on column layer_permission.layer_id is 'Identifier of the layer that the permissions belong to.';
comment on column layer_permission.user_group is 'Name of the user group that the permissions belong to.';
comment on column layer_permission.create_layer is 'Whether user can create layers or not.';
comment on column layer_permission.read_layer is 'Whether user can read layers or not.';
comment on column layer_permission.update_layer is 'Whether user can update layers or not.';
comment on column layer_permission.delete_layer is 'Whether user can delete layers or not.';
