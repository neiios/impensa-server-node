# Impensa Server Node

## Development

Create a `.env` file in the root of cloned project:

```conf
POSTGRES_DBUSER = postgres
POSTGRES_DBPASS = postgres
POSTGRES_DBHOST = localhost
POSTGRES_DBPORT = 6969
POSTGRES_DBNAME = impensa_server_node
JWT_SECRET      = barbim
```

Create the postgres container:

```bash
docker compose up -d
```
