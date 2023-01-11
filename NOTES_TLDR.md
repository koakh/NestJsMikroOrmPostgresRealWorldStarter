# NOTES_TLDR

> if give error with stalled migrations, remove migrations from dist folder or full dist folder with `rm dist/ -R`

## Run with Docker Stack

```shell
$ pnpm docker:teardown
$ pnpm docker:up
$ pnpm migration:create
$ pnpm migration:seed

$ curl -k --request POST \
  --url https://127.0.0.1:8443/api/users/login \
  --header 'content-type: application/json' \
  --header 'user-agent: vscode-restclient' \
  --data '{"email": "user@example.com","password": "12345678"}' \
  | jq
```

## Run in Debug Mode

with commented docker-composer `app`, optionally can leave `app` section uncomment bu beware to not use same port, always is better to don't have it running to prevent work with wrong service port

```shell
# optional, run only if don't have db ready
$ pnpm docker:teardown
$ pnpm docker:up
$ pnpm migration:create
$ pnpm migration:seed
# run debug mode
$ pnpm docker:up
$ pnpm start:debug
# or on liner
$ pnpm docker:teardown && pnpm docker:up && pnpm migration:create && pnpm migration:seed
# now launch debugger "Launch via NPM"
```

add breakpoint to `@Post('users/login')` and launch debugger

now send above curl, or use rest client