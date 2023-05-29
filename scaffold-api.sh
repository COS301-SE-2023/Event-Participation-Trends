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
