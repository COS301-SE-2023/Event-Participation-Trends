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
yarn nx generate @nrwl/angular:component usermanagement --project=app-usermanagement-feature --export --flat --type=page --standalone
yarn nx generate @nrwl/angular:module usermanagement --project=app-usermanagement-feature --routing
yarn nx generate @nrwl/angular:module usermanagement --project=app-usermanagement-data-access

# VIEW EVENTS
yarn nx generate @nrwl/angular:component view-events --project=app-view-events-feature --export --flat --type=page --standalone
yarn nx generate @nrwl/angular:module view-events --project=app-view-events-feature --routing
yarn nx generate @nrwl/angular:module view-events --project=app-view-events-data-access

# COMPARE EVENTS
yarn nx generate @nrwl/angular:component compare-events --project=app-compare-events-feature --export --flat --type=page --standalone
yarn nx generate @nrwl/angular:module compare-events --project=app-compare-events-feature --routing
yarn nx generate @nrwl/angular:module compare-events --project=app-compare-events-data-access

# DASHBOARD
yarn nx generate @nrwl/angular:component dashboard --project=app-dashboard-feature --export --flat --type=page --standalone
yarn nx generate @nrwl/angular:module dashboard --project=app-dashboard-feature --routing
yarn nx generate @nrwl/angular:module dashboard --project=app-dashboard-data-access

# My Events (for Event Manager)
yarn nx generate @nrwl/angular:component manager-events --project=app-manager-events-feature --export --flat --type=page --standalone
yarn nx generate @nrwl/angular:module manager-events --project=app-manager-events-feature --routing
yarn nx generate @nrwl/angular:module manager-events --project=app-manager-events-data-access

# Floor Editor
yarn nx generate @nrwl/angular:component floor-editor --project=app-floor-editor-feature --export --flat --type=page --standalone
yarn nx generate @nrwl/angular:module floor-editor --project=app-floor-editor-feature --routing
yarn nx generate @nrwl/angular:module floor-editor --project=app-floor-editor-data-access

# Event Details
yarn nx generate @nrwl/angular:component event-details --project=app-event-details-feature --export --flat --type=page --standalone
yarn nx generate @nrwl/angular:module event-details --project=app-event-details-feature --routing
yarn nx generate @nrwl/angular:module event-details --project=app-event-details-data-access

# Event Full View
yarn nx generate @nrwl/angular:component event-full-view --project=app-event-full-view-feature --export --flat --type=page --standalone
yarn nx generate @nrwl/angular:module event-full-view --project=app-event-full-view-feature --routing
yarn nx generate @nrwl/angular:module event-full-view --project=app-event-full-view-data-access

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
yarn nx generate @nrwl/js:library feature --unitTestRunner=jest --directory=app/usermanagement --no-interactive     # --> feature
yarn nx generate @nrwl/js:library data-access --unitTestRunner=jest --directory=app/usermanagement --no-interactive # --> data-access
yarn nx generate @nrwl/js:library util --unitTestRunner=jest --directory=app/usermanagement --no-interactive        # --> util

# VIEW EVENTS
yarn nx generate @nrwl/js:library feature --unitTestRunner=jest --directory=app/view-events --no-interactive     # --> feature
yarn nx generate @nrwl/js:library data-access --unitTestRunner=jest --directory=app/view-events --no-interactive # --> data-access
yarn nx generate @nrwl/js:library util --unitTestRunner=jest --directory=app/view-events --no-interactive        # --> util

# COMPARE EVENTS
yarn nx generate @nrwl/js:library feature --unitTestRunner=jest --directory=app/compare-events --no-interactive     # --> feature
yarn nx generate @nrwl/js:library data-access --unitTestRunner=jest --directory=app/compare-events --no-interactive # --> data-access
yarn nx generate @nrwl/js:library util --unitTestRunner=jest --directory=app/compare-events --no-interactive        # --> util

# DASHBOARD
yarn nx generate @nrwl/js:library feature --unitTestRunner=jest --directory=app/dashboard --no-interactive     # --> feature
yarn nx generate @nrwl/js:library data-access --unitTestRunner=jest --directory=app/dashboard --no-interactive # --> data-access
yarn nx generate @nrwl/js:library util --unitTestRunner=jest --directory=app/dashboard --no-interactive        # --> util

# My Events (for Event Manager)
yarn nx generate @nrwl/js:library feature --unitTestRunner=jest --directory=app/manager-events --no-interactive     # --> feature
yarn nx generate @nrwl/js:library data-access --unitTestRunner=jest --directory=app/manager-events --no-interactive # --> data-access
yarn nx generate @nrwl/js:library util --unitTestRunner=jest --directory=app/manager-events --no-interactive        # --> util

# Floor Editor
yarn nx generate @nrwl/js:library feature --unitTestRunner=jest --directory=app/floor-editor --no-interactive     # --> feature
yarn nx generate @nrwl/js:library data-access --unitTestRunner=jest --directory=app/floor-editor --no-interactive # --> data-access
yarn nx generate @nrwl/js:library util --unitTestRunner=jest --directory=app/floor-editor --no-interactive        # --> util

# Event Details
yarn nx generate @nrwl/js:library feature --unitTestRunner=jest --directory=app/event-details --no-interactive     # --> feature
yarn nx generate @nrwl/js:library data-access --unitTestRunner=jest --directory=app/event-details --no-interactive # --> data-access
yarn nx generate @nrwl/js:library util --unitTestRunner=jest --directory=app/event-details --no-interactive        # --> util

# Event Full View
yarn nx generate @nrwl/js:library feature --unitTestRunner=jest --directory=app/event-full-view --no-interactive     # --> feature
yarn nx generate @nrwl/js:library data-access --unitTestRunner=jest --directory=app/event-full-view --no-interactive # --> data-access
yarn nx generate @nrwl/js:library util --unitTestRunner=jest --directory=app/event-full-view --no-interactive        # --> util