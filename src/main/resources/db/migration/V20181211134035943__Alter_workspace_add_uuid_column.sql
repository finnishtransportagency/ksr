delete from WORKSPACE_LAYER;
delete from WORKSPACE;
alter table WORKSPACE add uuid char(36) unique not null;
