alter table layer
    add (
        use_internal_proxy char(1) default '1' not null
            check (use_internal_proxy in ('0', '1'))
);
