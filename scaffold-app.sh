set -ex

#------------------------- To Generate components and modules

#---------------------------------------------------------------------------------------------------------------------------------------------------------------------
#---- Note: When generating a module with --routing, it creates a file 'example-routing.module.ts' for the routing module. You must rename it to 'example.routing.ts'
#---- Note: Use --type=page if the component is a page else use --type=component if it is a small component on a page e.g. card component
#---------------------------------------------------------------------------------------------------------------------------------------------------------------------

# CORE
yarn nx generate @nrwl/angular:component core --project=app-core-feature --export --flat --type=shell --standalone
yarn nx generate @nrwl/angular:module core --project=app-core-feature --routing

# ERROR
yarn nx generate @nrwl/angular:module error --project=app-error-feature
yarn nx generate @nrwl/angular:module error --project=app-error-data-access

# LOGIN
yarn nx generate @nrwl/angular:component login --project=app-login-feature --export --flat --type=page
yarn nx generate @nrwl/angular:module login --project=app-login-feature --routing

# AUTH
yarn nx generate @nrwl/angular:module auth --project=app-auth-feature
yarn nx generate @nrwl/angular:module auth --project=app-auth-data-access

# HOME
yarn nx generate @nrwl/angular:module home --project=app-home-feature --routing

# USER MANAGEMENT (Tab visible for Admins only)
yarn nx generate @nrwl/angular:component user-management --project=app-user-management-feature --export --flat --type=page --standalone
yarn nx generate @nrwl/angular:module user-management --project=app-user-management-feature --routing
yarn nx generate @nrwl/angular:module user-management --project=app-user-management-data-access

# VIEW EVENTS
yarn nx generate @nrwl/angular:component view-events --project=app-view-events-feature --export --flat --type=page --standalone
yarn nx generate @nrwl/angular:module view-events --project=app-view-events-feature --routing
yarn nx generate @nrwl/angular:module view-events --project=app-view-events-data-access

# ============================================================================================================================

#------------------------- To Generate libraries

# CORE
yarn nx generate @nrwl/js:library feature --unitTestRunner=jest --directory=app/core --no-interactive

# ERROR
yarn nx generate @nrwl/js:library feature --unitTestRunner=jest --directory=app/error --no-interactive
yarn nx generate @nrwl/js:library data-access --unitTestRunner=jest --directory=app/error --no-interactive
yarn nx generate @nrwl/js:library util --unitTestRunner=jest --directory=app/error --no-interactive

# LOGIN
yarn nx generate @nrwl/js:library feature --unitTestRunner=jest --directory=app/login --no-interactive     # --> feature
yarn nx generate @nrwl/js:library data-access --unitTestRunner=jest --directory=app/login --no-interactive # --> data-access
yarn nx generate @nrwl/js:library util --unitTestRunner=jest --directory=app/login --no-interactive        # --> util

# Auth
yarn nx generate @nrwl/js:library feature --unitTestRunner=jest --directory=app/auth --no-interactive     # --> feature
yarn nx generate @nrwl/js:library data-access --unitTestRunner=jest --directory=app/auth --no-interactive # --> data-access
yarn nx generate @nrwl/js:library util --unitTestRunner=jest --directory=app/auth --no-interactive        # --> util

# HOME
yarn nx generate @nrwl/js:library feature --unitTestRunner=jest --directory=app/home --no-interactive     # --> feature

# USER MANAGEMENT (Used by Admins only)
yarn nx generate @nrwl/js:library feature --unitTestRunner=jest --directory=app/user-management --no-interactive     # --> feature
yarn nx generate @nrwl/js:library data-access --unitTestRunner=jest --directory=app/user-management --no-interactive # --> data-access
yarn nx generate @nrwl/js:library util --unitTestRunner=jest --directory=app/user-management --no-interactive        # --> util

# VIEW EVENTS
yarn nx generate @nrwl/js:library feature --unitTestRunner=jest --directory=app/view-events --no-interactive     # --> feature
yarn nx generate @nrwl/js:library data-access --unitTestRunner=jest --directory=app/view-events --no-interactive # --> data-access
yarn nx generate @nrwl/js:library util --unitTestRunner=jest --directory=app/view-events --no-interactive        # --> util