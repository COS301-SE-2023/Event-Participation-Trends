set -ex

#------------------------- To Generate components and modules

# Login
yarn nx generate @nrwl/angular:component login --project=app-login-feature --export --flat --standalone --type=page # use --type=page if the component is a page else use --type=component if it is a small component on a page e.g. card component
yarn nx generate @nrwl/angular:module login --project=app-login-feature

# ============================================================================================================================

#------------------------- To Generate libraries

# Login
yarn nx generate @nrwl/js:library feature --unitTestRunner=jest --directory=app/login --no-interactive     # --> feature
yarn nx generate @nrwl/js:library data-access --unitTestRunner=jest --directory=app/login --no-interactive # --> data-access
yarn nx generate @nrwl/js:library util --unitTestRunner=jest --directory=app/login --no-interactive        # --> util