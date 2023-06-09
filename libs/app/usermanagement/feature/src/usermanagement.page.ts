import { Component, ElementRef, ViewChild } from '@angular/core';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

@Component({
  selector: 'event-participation-trends-usermanagement',
  templateUrl: './usermanagement.page.html',
  styleUrls: ['./usermanagement.page.css'],
})
export class UsermanagementPage {
  @ViewChild('content-body', { static: true }) contentBody!: ElementRef;

  constructor(private containerElement: ElementRef) {}

  overflow = false;

  ngAfterViewInit() {
    this.checkOverflow();
  }

  checkOverflow() {
    const container = this.containerElement.nativeElement;
    this.overflow = container.scrollHeight > container.clientHeight;
  }

  users: User[] = [
    {
      id: 1,
      name: 'User 1',
      email: 'user1@gmail.com',
      role: 'Manager',
    },
    {
      id: 2,
      name: 'User 2',
      email: 'user2@gmail.com',
      role: 'Viewer',
    },
  ]

  isEmpty(): boolean {
    return this.users.length === 0;
  }

  isManager(user: User): boolean {
    return user.role === 'Manager';
  }

  setRole(user: User, checked: boolean): void {
    user.role = checked ? 'Manager' : 'Viewer';
  }

  toggleRole(user: User): void {
    user.role = this.isManager(user) ? 'Viewer' : 'Manager';
  }

}
