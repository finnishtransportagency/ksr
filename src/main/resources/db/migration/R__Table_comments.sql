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
comment on column layer.use_internal_proxy is 'Proxy requests on dev/test/prod -environments.';
comment on column layer.address_field is 'Name of layers address field.';
comment on column layer.feature_type is 'Type of the feature. Either road, water, railway or null.';
comment on column layer.updater_field is 'Field-name on the layer containing name of updater.';
comment on column layer.contract_id_field is 'Name of contract-relation id field to be shown in contract list.';
comment on column layer.contract_description_field is 'Name of contract-relation description field to be shown in contract list.';
comment on column layer.alfresco_link_field is 'Name of columns which refers layer contract number and/or register number for Alfresco.';
comment on column layer.case_management_link_field is 'Name of columns which refers layer contract number and/or register number for Asianhallinta.';
comment on column layer.background is 'If the layer can be used as a background layer. Defaults to false ("0"). ';
comment on column layer.parent_layer is 'Id of parent layer which sublayer belongs to.';
comment on column layer.property_id_field is 'Name of property id field';
comment on column layer.required_unique_fields is 'Feature columns which should be not-null and unique. Will be used when adding new feature (unique check) or when editing existing feature (not editable).';

comment on table layer_permission is 'Layer permissions.';
comment on column layer_permission.layer_id is 'Identifier of the layer that the permissions belong to.';
comment on column layer_permission.user_group is 'Name of the user group that the permissions belong to.';
comment on column layer_permission.create_layer is 'Whether user can create layers or not.';
comment on column layer_permission.read_layer is 'Whether user can read layers or not.';
comment on column layer_permission.update_layer is 'Whether user can update layers or not.';
comment on column layer_permission.delete_layer is 'Whether user can delete layers or not.';

comment on table user_layer is 'User layer details.';
comment on column user_layer.id is 'Generated layer identifier. Primary key. Starts at 10000';
comment on column user_layer.name is 'Name of the layer.';
comment on column user_layer.type is 'Type of the layer. Either wms, wfs, mvt, wmts, agfs (= ArcGIS Feature Service Spatial Layer) or agfl (= ArcGIS Feature Service Non Spatial Layer).';
comment on column user_layer.url is 'Url of the service where the layer is fetched from.';
comment on column user_layer.layers is 'Comma separated string of layers which are used from the service.';
comment on column user_layer.styles is 'JSON formatted string of styles for the layers.';
comment on column user_layer.opacity is 'Opacity of the layer.';
comment on column user_layer.authentication is 'AES256 encrypted Base64 encoded authentication string or null if the layer does not need authentication.';
comment on column user_layer.layer_order is 'Order of the layers. Starts at 10000';
comment on column user_layer.min_scale is 'The minimum scale at which the layer is visible.';
comment on column user_layer.max_scale is 'The maximum scale at which the layer is visible.';
comment on column user_layer.transparent is 'Whether the layer is transparent or not.';
comment on column user_layer.attribution is 'Layer copyright information.';
comment on column user_layer.desktop_visible is 'Whether the layer is visible or not on desktop.';
comment on column user_layer.mobile_visible is 'Whether the layer is visible or not on mobile.';
comment on column user_layer.queryable is 'Whether the layer can be queried or not.';
comment on column user_layer.query_columns is 'Columns which are used in free word query.';
comment on column user_layer.username is 'Identifier of the user that the layer belongs to.';

comment on table workspace is 'Saved workspaces.';
comment on column workspace.id is 'Generated workspace identifier. Primary key.';
comment on column workspace.uuid is 'UUID-identifier for workspace. Unique and not null.';
comment on column workspace.name is 'Name of the workspace.';
comment on column workspace.username is 'Username of the user that the workspace belongs to.';
comment on column workspace.scale is 'Scale of the map.';
comment on column workspace.center_longitude is 'Longitude of map''s center point.';
comment on column workspace.center_latitude is 'Latitude of map''s center point.';
comment on column workspace.updated is 'Time of last update on the workspace.';

comment on table workspace_layer is 'Workspace layer details.';
comment on column workspace_layer.workspace_id is 'Identifier of the workspace that the layer belongs to.';
comment on column workspace_layer.layer_id is 'Identifier of the layer.';
comment on column workspace_layer.user_layer_id is 'Identifier of the layer that user has added.';
comment on column workspace_layer.visible is 'Whether the layer is visible or not.';
comment on column workspace_layer.opacity is 'Opacity of the layer.';
comment on column workspace_layer.layer_order is 'Order of the layers.';
comment on column workspace_layer.definition_expression is 'Filter condition for the layer in case of a search layer.';
comment on column workspace_layer.selected_features is 'Features selected from the layer and whether they are highlighted or not.';

comment on column relation.id is 'Generated relation identifier. Primary key.';
comment on column relation.layer_id is 'Layer id.';
comment on column relation.relation_type is 'Relation type. Either "one", "many", "link" or NULL.';
comment on column relation.relation_layer_id is 'Id of the related layer. Related-layer is another entry in Layer-table.';
comment on column relation.relation_column_in is 'Column/field-name on the related layer that relation_column_out references to.';
comment on column relation.relation_column_out is 'Column/field-name which references to other layers relation_column_id.';
