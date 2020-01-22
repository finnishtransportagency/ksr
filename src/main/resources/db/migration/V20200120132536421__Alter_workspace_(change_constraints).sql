alter table workspace
    modify username null;

alter table workspace 
    add constraint username_or_public 
        check ((username is null and isPublic = 1) or (username is not null and isPublic = 0))
