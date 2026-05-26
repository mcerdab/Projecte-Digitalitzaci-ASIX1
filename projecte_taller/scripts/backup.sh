#!/bin/bash

docker exec projecte_taller-db-1 mariadb-dump --all-databases -uroot -p"HolaQuet4l?1234" > backup.sql

echo "Backup creat correctament: backup.sql"
