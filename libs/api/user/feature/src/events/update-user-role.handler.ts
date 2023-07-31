import { UpdateUserRoleEvent } from '@event-participation-trends/api/user/util';
import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { UserRepository } from '@event-participation-trends/api/user/data-access';
import { EmailService } from '@event-participation-trends/api/email/feature'
import { EmailContent, EmailSubject} from '@event-participation-trends/api/email/util';

@EventsHandler(UpdateUserRoleEvent)
export class UpdateUserRoleEventHandler implements IEventHandler<UpdateUserRoleEvent> {
  constructor(
    private readonly repository: UserRepository,
    private readonly emailService: EmailService,
  ) {}

  async handle(event: UpdateUserRoleEvent) {
    console.log(`${UpdateUserRoleEventHandler.name}`);

    await this.repository.updateUserRole(event.request.UserEmail || "",event.request.UpdateRole || "");

    let emailContent = EmailContent.ROLE_CHANGE_MANAGER_TO_VIEWER_CONTENT;
    if(event.request.UpdateRole == "manager")
        emailContent = EmailContent.ROLE_CHANGE_VIEWER_TO_MANAGER_CONTENT;
    
    //notify user via Email
    this.emailService.sendEmail(
        event.request.UserEmail  || "", 
        EmailSubject.ROLE_CHANGED,
        emailContent,
    )

  }
}