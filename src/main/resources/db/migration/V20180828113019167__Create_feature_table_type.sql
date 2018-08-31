create type feature_type as object (
    id varchar2(100),
    highlight char(1)
);
/
create type feature_table_type as table of feature_type;
