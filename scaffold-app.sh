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

# ACCESS REQUESTS
yarn nx generate @nrwl/angular:component accessrequests --project=app-accessrequests-feature --export --flat --type=component

# USER MANAGEMENT (Tab visible for Admins only)
yarn nx generate @nrwl/angular:component usermanagement --project=app-usermanagement-feature --export --flat --type=page --standalone
yarn nx generate @nrwl/angular:module usermanagement --project=app-usermanagement-feature --routing
yarn nx generate @nrwl/angular:module usermanagement --project=app-usermanagement-data-access

# VIEW EVENTS
yarn nx generate @nrwl/angular:component viewevents --project=app-viewevents-feature --export --flat --type=page --standalone
yarn nx generate @nrwl/angular:module viewevents --project=app-viewevents-feature --routing
yarn nx generate @nrwl/angular:module viewevents --project=app-viewevents-data-access

# COMPARE EVENTS
yarn nx generate @nrwl/angular:component comparingevents --project=app-comparingevents-feature --export --flat --type=page --standalone
yarn nx generate @nrwl/angular:module comparingevents --project=app-comparingevents-feature --routing
yarn nx generate @nrwl/angular:module comparingevents --project=app-comparingevents-data-access

# DASHBOARD
yarn nx generate @nrwl/angular:component dashboard --project=app-dashboard-feature --export --flat --type=page --standalone
yarn nx generate @nrwl/angular:module dashboard --project=app-dashboard-feature --routing
yarn nx generate @nrwl/angular:module dashboard --project=app-dashboard-data-access

# My Events (for Event Manager)
yarn nx generate @nrwl/angular:component managerevents --project=app-managerevents-feature --export --flat --type=page --standalone
yarn nx generate @nrwl/angular:module managerevents --project=app-managerevents-feature --routing
yarn nx generate @nrwl/angular:module managerevents --project=app-managerevents-data-access

# Floor Editor
yarn nx generate @nrwl/angular:component flooreditor --project=app-flooreditor-feature --export --flat --type=page --standalone
yarn nx generate @nrwl/angular:module flooreditor --project=app-flooreditor-feature --routing
yarn nx generate @nrwl/angular:module flooreditor --project=app-flooreditor-data-access

# Event Details
yarn nx generate @nrwl/angular:component eventdetails --project=app-eventdetails-feature --export --flat --type=page --standalone
yarn nx generate @nrwl/angular:module eventdetails --project=app-eventdetails-feature --routing
yarn nx generate @nrwl/angular:module eventdetails --project=app-eventdetails-data-access

# Event Full View
yarn nx generate @nrwl/angular:component eventscreenview --project=app-eventscreenview-feature --export --flat --type=page --standalone
yarn nx generate @nrwl/angular:module eventscreenview --project=app-eventscreenview-feature --routing
yarn nx generate @nrwl/angular:module eventscreenview --project=app-eventscreenview-data-access

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
yarn nx generate @nrwl/js:library feature --unitTestRunner=jest --directory=app/viewevents --no-interactive     # --> feature
yarn nx generate @nrwl/js:library data-access --unitTestRunner=jest --directory=app/viewevents --no-interactive # --> data-access
yarn nx generate @nrwl/js:library util --unitTestRunner=jest --directory=app/viewevents --no-interactive        # --> util

# COMPARE EVENTS
yarn nx generate @nrwl/js:library feature --unitTestRunner=jest --directory=app/comparingevents --no-interactive     # --> feature
yarn nx generate @nrwl/js:library data-access --unitTestRunner=jest --directory=app/comparingevents --no-interactive # --> data-access
yarn nx generate @nrwl/js:library util --unitTestRunner=jest --directory=app/comparingevents --no-interactive        # --> util

# DASHBOARD
yarn nx generate @nrwl/js:library feature --unitTestRunner=jest --directory=app/dashboard --no-interactive     # --> feature
yarn nx generate @nrwl/js:library data-access --unitTestRunner=jest --directory=app/dashboard --no-interactive # --> data-access
yarn nx generate @nrwl/js:library util --unitTestRunner=jest --directory=app/dashboard --no-interactive        # --> util

# My Events (for Event Manager)
yarn nx generate @nrwl/js:library feature --unitTestRunner=jest --directory=app/managerevents --no-interactive     # --> feature
yarn nx generate @nrwl/js:library data-access --unitTestRunner=jest --directory=app/managerevents --no-interactive # --> data-access
yarn nx generate @nrwl/js:library util --unitTestRunner=jest --directory=app/managerevents --no-interactive        # --> util

# Floor Editor
yarn nx generate @nrwl/js:library feature --unitTestRunner=jest --directory=app/flooreditor --no-interactive     # --> feature
yarn nx generate @nrwl/js:library data-access --unitTestRunner=jest --directory=app/flooreditor --no-interactive # --> data-access
yarn nx generate @nrwl/js:library util --unitTestRunner=jest --directory=app/flooreditor --no-interactive        # --> util

# Event Details
yarn nx generate @nrwl/js:library feature --unitTestRunner=jest --directory=app/eventdetails --no-interactive     # --> feature
yarn nx generate @nrwl/js:library data-access --unitTestRunner=jest --directory=app/eventdetails --no-interactive # --> data-access
yarn nx generate @nrwl/js:library util --unitTestRunner=jest --directory=app/eventdetails --no-interactive        # --> util

# Event Full View
yarn nx generate @nrwl/js:library feature --unitTestRunner=jest --directory=app/eventscreenview --no-interactive     # --> feature
yarn nx generate @nrwl/js:library data-access --unitTestRunner=jest --directory=app/eventscreenview --no-interactive # --> data-access
yarn nx generate @nrwl/js:library util --unitTestRunner=jest --directory=app/eventscreenview --no-interactive        # --> util