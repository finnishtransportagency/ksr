alter table layer add (
  contract_relation_type varchar2(4)
    check (contract_relation_type in ('one', 'many', NULL)),
  contract_layer_id number(10) references layer(id) on delete set null,
  contract_number_column varchar2(30)
);
