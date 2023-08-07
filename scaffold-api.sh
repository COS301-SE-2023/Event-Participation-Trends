#!/usr/bin/env bash

set -ex

# CORE
yarn nx generate @nrwl/js:library feature --unitTestRunner=jest --directory=api/core --no-interactive

# VIEWER
yarn nx generate @nrwl/js:library feature --unitTestRunner=jest --directory=api/viewer --no-interactive
yarn nx generate @nrwl/js:library data-access --unitTestRunner=jest --directory=api/viewer --no-interactive
yarn nx generate @nrwl/js:library util --unitTestRunner=jest --directory=api/viewer --no-interactive

# MANAGER
yarn nx generate @nrwl/js:library feature --unitTestRunner=jest --directory=api/manager --no-interactive
yarn nx generate @nrwl/js:library data-access --unitTestRunner=jest --directory=api/manager --no-interactive
yarn nx generate @nrwl/js:library util --unitTestRunner=jest --directory=api/manager --no-interactive

# ADMIN
yarn nx generate @nrwl/js:library feature --unitTestRunner=jest --directory=api/admin --no-interactive
yarn nx generate @nrwl/js:library data-access --unitTestRunner=jest --directory=api/admin --no-interactive
yarn nx generate @nrwl/js:library util --unitTestRunner=jest --directory=api/admin --no-interactive

# USER
yarn nx generate @nrwl/js:library feature --unitTestRunner=jest --directory=api/user --no-interactive
yarn nx generate @nrwl/js:library data-access --unitTestRunner=jest --directory=api/user --no-interactive
yarn nx generate @nrwl/js:library util --unitTestRunner=jest --directory=api/user --no-interactive

# EVENT
yarn nx generate @nrwl/js:library feature --unitTestRunner=jest --directory=api/event --no-interactive
yarn nx generate @nrwl/js:library data-access --unitTestRunner=jest --directory=api/event --no-interactive
yarn nx generate @nrwl/js:library util --unitTestRunner=jest --directory=api/event --no-interactive

#GLOBAL
yarn nx generate @nrwl/js:library feature --unitTestRunner=jest --directory=api/global --no-interactive
yarn nx generate @nrwl/js:library data-access --unitTestRunner=jest --directory=api/global --no-interactive
yarn nx generate @nrwl/js:library util --unitTestRunner=jest --directory=api/global --no-interactive

#EMAIL
yarn nx generate @nrwl/js:library feature --unitTestRunner=jest --directory=api/email --no-interactive
yarn nx generate @nrwl/js:library data-access --unitTestRunner=jest --directory=api/email --no-interactive
yarn nx generate @nrwl/js:library util --unitTestRunner=jest --directory=api/email --no-interactive

#DATABASE
yarn nx generate @nrwl/js:library feature --unitTestRunner=jest --directory=api/database --no-interactive