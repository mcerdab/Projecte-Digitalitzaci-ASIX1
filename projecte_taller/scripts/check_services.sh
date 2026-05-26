#!/bin/bash

echo "Comprovant API..."
curl -s http://localhost:5000/vehicles > /dev/null && echo "API OK" || echo "API KO"

echo "Comprovant base de dades..."
docker exec projecte_taller-db-1 mariadb-admin ping -uroot -p"HolaQuet4l?1234" && echo "DB OK" || echo "DB KO"

echo "Comprovant web..."
curl -s http://localhost:8080 > /dev/null && echo "WEB OK" || echo "WEB KO"