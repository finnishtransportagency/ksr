alter table layer drop column contract_relation_type;
alter table layer add (
  relation_column_out varchar2(30),
  relation_type varchar2(4)
    check (relation_type in ('one', 'many', 'link', NULL))
);
alter table layer rename column contract_number_column to relation_column_in;
alter table layer rename column contract_layer_id to relation_layer_id;
