# hubz-ui-api

## usage
```
 create .env from template listed below under .env
```
```bash
cd hubz-ui-api
npm install
npm run dev
```

## .env

```
PLAID_CLIENT_ID                 you must register an account at plaid to retreive client_id  
PLAID_CLIENT_SECRET             you must register an account at plaid to retreive client_secret
PLAID_ENCRYPTION_KEY            generated encryption key
JWT_ENCRYPTION_KEY              generated encryption key
NODE_BASE_URL                   where node server is running ex: http://localhost:8080
BUCKET_NAME                     bucket name for storing home drive items in s3
IAM_USER_KEY                    aws iam_user_key provided by aws
IAM_USER_SECRET                 aws iam_user_secret provided by aws
DATABASE_CONNECTION_STRING      db connection string
FRONT_END_URL                   front end url where react app is running -> for CORS 
AUTH_ENABLED                    enabling authentication for app -> no auth you will be provided with dev user credentials
```
