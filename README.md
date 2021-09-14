# forge

`forge` is a library and command line tool that allows developers to put together streams as pipelines.

See the `forge` [README.md](forge/README.md) for more details.

This project and its documentation is a Work in Progress.

## Publishing

```bash
# Ensure the NpM Token is set
rush publish --set-access-level public --apply --publish -n $NPM_AUTH_TOKEN --tag latest --include-all --target-branch master
```

## Potential Future Plugins/Features
* Web Crawler
* Be able to run a single step multiple times in parallel, and treat the results as a single stream.
* Display the Bytes/Object per second while it's running