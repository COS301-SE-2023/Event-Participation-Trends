set -ex

#------------------------- To Generate components and modules

#---------------------------------------------------------------------------------------------------------------------------------------------------------------------
#---- Note: When generating a module with --routing, it creates a file 'example-routing.module.ts' for the routing module. You must rename it to 'example.routing.ts'
#---- Note: Use --type=page if the component is a page else use --type=component if it is a small component on a page e.g. card component
#---------------------------------------------------------------------------------------------------------------------------------------------------------------------

# CORE
yarn nx generate @nrwl/angular:module core --project=app-core-feature --routing
yarn nx generate @nrwl/angular:component core --project=app-core-feature --export --flat --standalone --type=shell

# LOGIN
yarn nx generate @nrwl/angular:component login --project=app-login-feature --export --flat --standalone --type=page
yarn nx generate @nrwl/angular:module login --project=app-login-feature --routing

# ============================================================================================================================

#------------------------- To Generate libraries

# CORE
yarn nx generate @nrwl/js:library feature --unitTestRunner=jest --directory=app/core --no-interactive

# LOGIN
yarn nx generate @nrwl/js:library feature --unitTestRunner=jest --directory=app/login --no-interactive     # --> feature
yarn nx generate @nrwl/js:library data-access --unitTestRunner=jest --directory=app/login --no-interactive # --> data-access
yarn nx generate @nrwl/js:library util --unitTestRunner=jest --directory=app/login --no-interactive        # --> util