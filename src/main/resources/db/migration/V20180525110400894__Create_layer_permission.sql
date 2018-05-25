create table layer_permission (
    layer_id number(10) references layer(id),
    user_group varchar2(20),
    create_layer char(1) default '0' not null
        check (create_layer in ('0', '1')),
    read_layer char(1) default '0' not null
        check (read_layer in ('0', '1')),
    update_layer char(1) default '0' not null
        check (update_layer in ('0', '1')),
    delete_layer char(1) default '0' not null
        check (delete_layer in ('0', '1')),
    primary key (layer_id, user_group)
);
