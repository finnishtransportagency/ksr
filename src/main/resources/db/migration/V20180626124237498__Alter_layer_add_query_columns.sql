alter table layer
    add (
        queryable char(1) default '0' not null
            check (queryable in ('0', '1')),
        query_columns query_column_type
);
