alter table layer
    add (
        address_field varchar2(50),
        feature_type varchar2(7)
            check (feature_type in ('road', 'water', 'railway'))
);
