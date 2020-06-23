CREATE TABLE RELATION
(
    ID                  NUMBER(10) PRIMARY KEY,
    LAYER_ID            NUMBER(10) NOT NULL
        REFERENCES LAYER (ID)
            ON DELETE CASCADE,
    RELATION_LAYER_ID   NUMBER(10)
        REFERENCES LAYER (ID)
           ON DELETE SET NULL,
    RELATION_COLUMN_IN  VARCHAR2(30),
    RELATION_COLUMN_OUT VARCHAR2(30),
    RELATION_TYPE       VARCHAR2(4)
        CHECK (RELATION_TYPE IN ('one', 'many', 'link', NULL))
);

create sequence relation_seq;

create or replace trigger relation_on_insert
    before insert
    on RELATION
    for each row
begin
    select relation_seq.nextval
    into :new.ID
    from dual;
end;
