# NOTES_TLDR

> if give error with stalled migrations, remove migrations from dist folder or full dist folder with `rm dist/ -R`

## Run with Docker Stack

```shell
$ pnpm docker:teardown
$ pnpm docker:up
$ pnpm migration:create
$ pnpm migration:seed

$ curl --request POST \
  --url https://192.168.1.103:3443/v1/users/login \
  --header 'content-type: application/json' \
  --header 'user-agent: vscode-restclient' \
  --data '{"user": {"email": "mail@koakh.com","password": "12345678"}}'
```

## Run in Debug Mode

with commented docker-composer `app`

```shell
$ pnpm docker:teardown
$ pnpm docker:up
$ pnpm migration:create
$ pnpm migration:seed
$ pnpm start:debug
```

add breakpoint to `@Post('users/login')` and launch debugger

now send above curl