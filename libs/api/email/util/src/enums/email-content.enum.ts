export enum EmailContent {
    ACCEPT_VIEW_REQUEST_CONTENT= "You have been made a Viewer of the event: ",
    ACCEPT_MANAGER_REQUEST_CONTENT= "You have been made a Manager of the event: ",
    REJECT_VIEW_REQUEST_CONTENT= "You have been denied Viewer access to the event: ",
    REJECT_MANAGER_REQUEST_CONTENT= "You have been denied Manager access to the event: ",
    REVOKE_VIEW_ACCESS_CONTENT= "You have been revoked Viewer access to the event: ",
    CREATE_EVENT_CONTENT= "Successfully created event: ",
    ROLE_CHANGE_MANAGER_TO_VIEWER_CONTENT= "Role reassigned from Manager to Viewer",
    ROLE_CHANGE_VIEWER_TO_MANAGER_CONTENT= "Role reassigned from Viewer to Manager",
    NEW_LINE= "\n",
    EVENT_DELETED_CONTENT= "Event has been successfully deleted: ",
}