begin
    for layer in (SELECT ID
              FROM LAYER
              WHERE LAYER_GROUP_ID = (SELECT ID
                                      FROM LAYER_GROUP
                                      WHERE LOWER(NAME) = 'kuntatietopalvelu'))
        loop
            execute immediate 'DELETE FROM LAYER_PERMISSION WHERE LAYER_ID = ' || layer.ID;
            execute immediate 'DELETE FROM WORKSPACE_LAYER WHERE LAYER_ID = ' || layer.ID;
        end loop;
    commit;

    for layer_group in (SELECT ID from LAYER_GROUP WHERE LOWER(NAME) = 'kuntatietopalvelu')
        loop
            execute immediate 'DELETE FROM LAYER WHERE LAYER_GROUP_ID = ' || layer_group.ID;
        end loop;
    commit;

    DELETE
    FROM LAYER_GROUP
    WHERE LOWER(NAME) = 'kuntatietopalvelu';
end;
