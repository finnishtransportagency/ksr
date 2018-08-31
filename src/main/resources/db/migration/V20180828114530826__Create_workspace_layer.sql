create table workspace_layer (
    workspace_id number(10) references workspace(id)
        on delete cascade,
    layer_id number(10) references layer(id)
        on delete cascade,
    user_layer_id number(10) references user_layer(id)
        on delete cascade,
    visible char(1) default '0' not null
        check (visible in ('0', '1')),
    opacity number(2, 1) default 1.0 not null
        check (opacity between 0.0 and 1.0),
    layer_order number(9) not null,
    definition_expression varchar2(4000),
    selected_features feature_table_type,
    primary key (workspace_id, layer_order),
    constraint layer_not_null_check check (layer_id is not null or user_layer_id is not null)
)
nested table selected_features store as selected_features_table;
