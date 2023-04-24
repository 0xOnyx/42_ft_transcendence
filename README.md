# ft_transcendence
pong project with react nest and typescript

## Running locally (docker)

To run the whole project with docker :
- Create an application on the 42 Intranet. Redirect on http://localhost/api/auth/callback
- Create the following file `backend/.env`
```
DATABASE_URL="postgresql://postgres:mysecretpassword@postgres:5432/transcendence?schema=public&connect_timeout=1000"
API_OAUTH2=https://api.intra.42.fr/
CLIENT_ID={42_APP_CLIENT_ID}
CLIENT_SECRET={42_APP_CLIENT_SECRET}
HOST=http://localhost/api
PHOTO_PATH=image
SECRET_COOKIE={SECRET_COOKIE}
REDIRECT=/portal
```
- `cd docker`
- `docker compose up --build`

### Available services

While the project is running, you have a postgres database at your disposal, with a pgadmin client on localhost:8080
## Browser support

ft_transcendence works in the latest versions of Chrome and Firefox.

```bash
make run 
```

### Database structure

the database structure can be found on this [link](docs/Database/database.md).

