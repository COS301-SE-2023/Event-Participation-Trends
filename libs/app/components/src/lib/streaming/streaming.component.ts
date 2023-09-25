import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconsModule, provideIcons } from '@ng-icons/core';
import { matSend, matChat, matClose, matArrowLeft, matArrowRight } from '@ng-icons/material-icons/baseline';
import { heroVideoCameraSlashSolid } from '@ng-icons/heroicons/solid';
import { AppApiService } from '@event-participation-trends/app/api';
import { FormsModule } from '@angular/forms';
import { ChatMessageComponent } from '../chat-message/chat-message.component';
import { Router } from '@angular/router';
import { IUser } from '@event-participation-trends/api/user/util';

interface VideoStream {
  id: number;
  name: string;
  url: string;
}
@Component({
  selector: 'event-participation-trends-streaming',
  standalone: true,
  imports: [CommonModule, NgIconsModule, FormsModule, ChatMessageComponent],
  templateUrl: './streaming.component.html',
  styleUrls: ['./streaming.component.css'],
  providers: [
    provideIcons({matSend, matChat, matClose, heroVideoCameraSlashSolid, matArrowLeft, matArrowRight})
  ]
})
export class StreamingComponent implements OnInit {
  @ViewChild('scrollContainer', {static: false}) scrollContainer!: ElementRef;

  newMessage = '';
  eventMessages: any = null; // this will change to an array of eventMessage objects
  videoStreams!:VideoStream[]; // this will change to an array of videoStream objects
  activeVideoStream:any = null; // this will change to a videoStream object
  isLargeScreen = false;
  chatToggled = false;
  showChat = false;
  isDropdownOpen = false;
  showArrows = false;
  timer: any;
  prevMessageSameUser = false;
  isUserEventManager = false;
  eventID = '';
  event: any = null;
  isExistingStream = false;
  activeUserID = '';
  activeUserEmail = '';
  activeUserFullName = '';
  activeUserProfilePic = '';
  isFirstMessageOfTheDay = false;

  constructor(private appApiService: AppApiService, private router: Router) { }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isLargeScreen = event.target.innerWidth > 1152;
  }

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    //if the target id is not the element with id videoStreams
    if (event.target.id !== 'videoStreams') {
      this.isDropdownOpen = false;
    }    
  }

  async ngOnInit() {
    this.eventID = this.router.url.split('/')[2];
    this.isLargeScreen = window.innerWidth > 1152;

    // for now this is just mock data until we have the API
    this.eventMessages = [
      {
        id: 1,
        text: 'Hello world! jjjjjjjjjjjjjjjjjjjjjjjjj jjjjjjjjjjjjjjjjjjj',
        timestamp: '2023-07-20T08:42:14.211+00:00',
        user: {
          id: '64c7cd4362769c8a0330ce0e',
          name: 'John Doe',
          email: 'u21457451@tuks.co.za',
          profilePic: 'assets/trash-delete.svg',
        },
      },
      {
        id: 2,
        text: 'Hello world! jjjjjjjjjjjjjjjjjjjjjjjjj jjjjjjjjjjjjjjjjjjj',
        timestamp: '2023-07-20T08:42:14.211+00:00',
        user: {
          id: '64c7cd4362769c8a0330ce0e',
          name: 'John Doe',
          email: 'u21457451@tuks.co.za',
          profilePic: 'assets/trash-delete.svg',
        },
      },
      {
        id: 3,
        text: 'Hello world! jjjjjjjjjjjjjjjjjjjjjjjjj jjjjjjjjjjjjjjjjjjj',
        timestamp: '2023-07-20T08:42:14.211+00:00',
        user: {
          id: '3',
          name: 'Jane Doe',
          email: 'arnojooste@gmail.com',
          profilePic: 'assets/trash-open.svg',
        },
      },
      {
        id: 4,
        text: 'Hello world! jjjjjjjjjjjjjjjjjjjjjjjjj jjjjjjjjjjjjjjjjjjj',
        timestamp: '2023-07-20T08:42:14.211+00:00',
        user: {
          id: '64c7c9b862769c8a0330cca0',
          name: 'Arno Jooste',
          email: 'arnojooste3008@gmail.com',
          profilePic: 'assets/stall-icon.png',
        },
      },
      {
        id: 1,
        text: 'Hello world! jjjjjjjjjjjjjjjjjjjjjjjjj jjjjjjjjjjjjjjjjjjj',
        timestamp: '2023-07-20T08:42:14.211+00:00',
        user: {
          id: '64c7cd4362769c8a0330ce0e',
          name: 'John Doe',
          email: 'u21457451@tuks.co.za',
          profilePic: 'assets/trash-delete.svg',
        },
      },
      {
        id: 2,
        text: 'Hello world! jjjjjjjjjjjjjjjjjjjjjjjjj jjjjjjjjjjjjjjjjjjj',
        timestamp: '2023-07-20T08:42:14.211+00:00',
        user: {
          id: '64c7cd4362769c8a0330ce0e',
          name: 'John Doe',
          email: 'u21457451@tuks.co.za',
          profilePic: 'assets/trash-delete.svg',
        },
      },
      {
        id: 3,
        text: 'Hello world! jjjjjjjjjjjjjjjjjjjjjjjjj jjjjjjjjjjjjjjjjjjj',
        timestamp: '2023-07-20T08:42:14.211+00:00',
        user: {
          id: '3',
          name: 'Jane Doe',
          email: 'arnojooste@gmail.com',
          profilePic: 'assets/trash-open.svg',
        },
      },
      {
        id: 4,
        text: 'Hello world! jjjjjjjjjjjjjjjjjjjjjjjjj jjjjjjjjjjjjjjjjjjj',
        timestamp: '2023-07-20T08:42:14.211+00:00',
        user: {
          id: '64c7c9b862769c8a0330cca0',
          name: 'Arno Jooste',
          email: 'arnojooste3008@gmail.com',
          profilePic: 'assets/stall-icon.png',
        },
      },
      {
        id: 1,
        text: 'Hello world! jjjjjjjjjjjjjjjjjjjjjjjjj jjjjjjjjjjjjjjjjjjj',
        timestamp: '2023-07-20T08:42:14.211+00:00',
        user: {
          id: '64c7cd4362769c8a0330ce0e',
          name: 'John Doe',
          email: 'u21457451@tuks.co.za',
          profilePic: 'assets/trash-delete.svg',
        },
      },
      {
        id: 2,
        text: 'Hello world! jjjjjjjjjjjjjjjjjjjjjjjjj jjjjjjjjjjjjjjjjjjj',
        timestamp: '2023-07-20T08:42:14.211+00:00',
        user: {
          id: '64c7cd4362769c8a0330ce0e',
          name: 'John Doe',
          email: 'u21457451@tuks.co.za',
          profilePic: 'assets/trash-delete.svg',
        },
      },
      {
        id: 3,
        text: 'Hello world! jjjjjjjjjjjjjjjjjjjjjjjjj jjjjjjjjjjjjjjjjjjj',
        timestamp: '2023-07-20T08:42:14.211+00:00',
        user: {
          id: '3',
          name: 'Jane Doe',
          email: 'arnojooste@gmail.com',
          profilePic: 'assets/trash-open.svg',
        },
      },
      {
        id: 4,
        text: 'Hello world! jjjjjjjjjjjjjjjjjjjjjjjjj jjjjjjjjjjjjjjjjjjj',
        timestamp: '2023-07-20T08:42:14.211+00:00',
        user: {
          id: '64c7c9b862769c8a0330cca0',
          name: 'Arno Jooste',
          email: 'arnojooste3008@gmail.com',
          profilePic: 'assets/stall-icon.png',
        },
      },
    ];

    // when removing these mocks, just also remove the files from the assets folder
    this.videoStreams = [
      {
        id: 1,
        name: 'Glowy-1',
        url: 'assets/Glowy_things_1_.mp4',
      },
      {
        id: 2,
        name: 'Graph-1',
        url: 'assets/Graph07.mp4',
      },
      {
        id: 3,
        'name': 'Mock-1',
        url : 'assets/mock-vid-1.mp4',
      },
      {
        id: 4,
        name: 'Glowy-2',
        url: 'assets/Glowy_things_1_.mp4',
      },
      {
        id: 5,
        name: 'Graph-2',
        url: 'assets/Graph07.mp4',
      },
      {
        id: 6,
        'name': 'Mock-2',
        url : 'assets/mock-vid-1.mp4',
      }
    ];

    this.activeVideoStream = this.videoStreams[0];

    const role = (await this.appApiService.getRole());

    if (role === 'admin') {
      this.event = (
        (await this.appApiService.getEvent({ eventId: this.eventID })) as any
      ).event;
    } else {
      this.event = (
        (await this.appApiService.getSubscribedEvents()) as any
      )
      .filter((event: any) => event._id === this.eventID)[0]
    }

    if (this.videoStreams.length > 0) {
      this.isExistingStream = true;
    }

    this.scrollToBottom();
  }

  // ngAfterViewChecked() {
  //   this.scrollToBottom();
  // }

  scrollToBottom(): void {
    setTimeout(() => {
      try {
        const container = this.scrollContainer.nativeElement;
        container.scrollTop = container.scrollHeight;
      } catch (err) {
        console.error('Error scrolling to bottom:', err);
      }
    },50);
  }

  get filteredStreams(): VideoStream[] {
    return this.videoStreams.filter((stream) => stream.id !== this.activeVideoStream.id);
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  isMessageFromManager(message: any): boolean {
    if (message.user.id === this.event?.Manager) {
      return true;
    }
    return false;
  }

  isPrevMessageSameUser(message: any, prevMessage: any): boolean {
    if (!prevMessage) return false;

    if (message.user.id === prevMessage.user.id) {
      return true;
    }
    return false;
  }

  isNextMessageSameUser(message: any, nextMessage: any): boolean {
    if (!nextMessage) return false;

    if (message.user.id === nextMessage.user.id) {
      return true;
    }
    return false;
  }

  checkIfFirstMessageOfTheDay(message: any, prevMessage: any): boolean {
    if (!prevMessage) return true;

    const messageDate = new Date(message.timestamp);
    const prevMessageDate = new Date(prevMessage.timestamp);

    if (messageDate.getDate() !== prevMessageDate.getDate()) {
      return true;
    }
    return false;
  }

  checkIfFirstMessageOfEvent(message: any): boolean {
    if (message === this.eventMessages[0]) {
      return true;
    }
    return false;
  }

  getDateForMessage(message: any): string {
    const messageDate = new Date(message.timestamp);
    const today = new Date();

    if (messageDate.getDate() === today.getDate()) {
      return 'Today';
    }
    else if (messageDate.getDate() === today.getDate() - 1) {
      return 'Yesterday';
    }
    else {
      return messageDate.toLocaleDateString();
    }
  }

  async sendMessage() {
    this.newMessage = (document.getElementById('messageInput') as HTMLInputElement)?.value || '';

    if (this.newMessage === '') {
      return;
    }
    else {
      const newMessageID = this.eventMessages.length + 1;

      this.appApiService.getEmail().then((email) => {
        this.activeUserEmail = email;
      });
      const users: IUser[] = await this.appApiService.getAllUsers();
      this.activeUserEmail = await this.appApiService.getEmail();
      this.activeUserID = (users.filter((user) => user.Email === this.activeUserEmail)[0] as any)._id;
      this.activeUserFullName = await this.appApiService.getFullName();
      this.activeUserProfilePic = await this.appApiService.getProfilePicUrl();

      const newMessage = {
        id: newMessageID,
        text: this.newMessage,
        timestamp: new Date().toISOString(),
        user: {
          id: this.activeUserID,
          name: this.activeUserFullName,
          email: this.activeUserEmail,
          profilePic: this.activeUserProfilePic,
        },
      };

      this.newMessage = '';
      (document.getElementById('messageInput') as HTMLInputElement).setAttribute('value', '');
      this.eventMessages.push(newMessage);
      this.scrollToBottom();
    }
  }

  hideChat(): void {
    const element = document.getElementById('chatMenu');
    if (element) {
      element.style.width = '0px';
    }
    this.chatToggled = false;
    this.showChat = false;
  }

  openChat() {
    this.chatToggled = true;
    this.showArrows = false;
    const element = document.getElementById('chatMenu');
    if (element) {
      element.style.width = '400px';
      this.scrollToBottom();
    }
  }

  setActiveVideoStream(event: any): void {
    this.activeVideoStream = this.videoStreams.find((stream) => stream.name === event.target.value);
    this.switchToStream();
  }

  onMouseOver(): void {
    this.showArrows = true; // Show the arrows when hovering
    this.clearTimer(); // Clear any existing timer
  }
  
  onMouseLeave(): void {
    // Set a timer to hide the arrows after 2 seconds (adjust as needed)
    this.timer = setTimeout(() => {
      this.showArrows = false;
    }, 2000);
  }

  onVideoClick(): void {
    this.showArrows = !this.showArrows;

    if (this.showArrows) {
      this.timer = setTimeout(() => {
        this.showArrows = false;
      }, 2000);
    }
  }
  
  clearTimer(): void {
    // Clear the timer if it exists
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  switchToPreviousStream(idx?: number): void {
    const index = this.videoStreams.findIndex((stream) => stream.id === this.activeVideoStream.id);
    if (index > 0) {
      this.activeVideoStream = this.videoStreams[index - 1];
      const videoElement = document.getElementById('video') as HTMLVideoElement;
      if (videoElement) {
        videoElement.load();
      }
    }
    else {
      this.activeVideoStream = this.videoStreams[this.videoStreams.length - 1];
      const videoElement = document.getElementById('video') as HTMLVideoElement;
      if (videoElement) {
        videoElement.load();
      }
    }
  }

  switchToNextStream(): void {
    const index = this.videoStreams.findIndex((stream) => stream.id === this.activeVideoStream.id);
    if (index < this.videoStreams.length - 1) {
      this.activeVideoStream = this.videoStreams[index + 1];
      const videoElement = document.getElementById('video') as HTMLVideoElement;
      if (videoElement) {
        videoElement.load();
      }
    }
    else {
      this.activeVideoStream = this.videoStreams[0];
      const videoElement = document.getElementById('video') as HTMLVideoElement;
      if (videoElement) {
        videoElement.load();
      }
    }
  }

  switchToStream(): void {
    const index = this.videoStreams.findIndex((stream) => stream.id === this.activeVideoStream.id);

    if (index === -1) {
      return;
    }
    this.activeVideoStream = this.videoStreams[index];
    const videoElement = document.getElementById('video') as HTMLVideoElement;
    if (videoElement) {
      videoElement.load();
    }
  }
}
