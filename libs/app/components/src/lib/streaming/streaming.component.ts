import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconsModule, provideIcons } from '@ng-icons/core';
import { matSend, matChat, matClose, matArrowLeft, matArrowRight } from '@ng-icons/material-icons/baseline';
import { heroFaceSmileSolid, heroVideoCameraSlashSolid } from '@ng-icons/heroicons/solid';
import { AppApiService } from '@event-participation-trends/app/api';
import { FormsModule } from '@angular/forms';
import { ChatMessageComponent } from '../chat-message/chat-message.component';
import { Router } from '@angular/router';
import { IUser } from '@event-participation-trends/api/user/util';
import { ConsumerComponent } from '../consumer/consumer.component';
import { Socket } from 'ngx-socket-io'


interface IEventMessage {
  id?: number;
  text: string;
  timestamp: string;
  user: IMessageUser;
}

interface IMessageUser {
  fullName: string;
  id: string;
  profilePic: string;
}

@Component({
  selector: 'event-participation-trends-streaming',
  standalone: true,
  imports: [CommonModule, NgIconsModule, FormsModule, ChatMessageComponent, ConsumerComponent],
  templateUrl: './streaming.component.html',
  styleUrls: ['./streaming.component.css'],
  providers: [
    provideIcons({matSend, heroFaceSmileSolid, matChat, matClose, heroVideoCameraSlashSolid, matArrowLeft, matArrowRight})
  ]
})
export class StreamingComponent implements OnInit, AfterViewInit {
  @ViewChild('scrollContainer', {static: false}) scrollContainer!: ElementRef;
  @ViewChild('consumer_component') consumer_component!: ConsumerComponent;
  public messageText = '';
  eventMessages: any = null; // this will change to an array of eventMessage objects
  activeVideoStream:any = null; // this will change to a videoStream object
  showEmojiPicker = false;
  isLargeScreen = true;
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
  videoStreams = true;
  private myUser : IMessageUser | null = null;
  private socket!: Socket;

  constructor(private appApiService: AppApiService, private router: Router) { }

  async emitEvent(event: string, data: any): Promise<any> {
    if(!this.socket){
      console.error('No socket connection');
    }
    return new Promise((resolve, reject) => {
      let done = false;
      this.socket.emit(event, data, (response: any) => {
        if (response.error) {
          done = true;
          console.error(response.error);
          reject(response.error);
        } else {
          done = true;
          resolve(response);
        }
      });
      setTimeout(()=>{
        if(!done){
          resolve(null);
        }
      }, 500);
    });
  }

  async ngAfterViewInit() {
    this.consumer_component.eventID = this.eventID;
    await this.consumer_component.connect();
    this.socket = this.consumer_component.socket;
    this.myUser = {
      id: await this.appApiService.getEmail(),
      fullName: await this.appApiService.getFullName(),
      profilePic: await this.appApiService.getProfilePicUrl(),
    }
    this.activeUserID = this.myUser.id;
    this.socket.fromEvent('message').subscribe((message: any) => {  
      this.eventMessages.push(message);
      this.scrollToBottom();
    });
  }

  async ngOnInit() {
    this.eventID = this.router.url.split('/')[2];
    this.isLargeScreen = window.innerWidth > 1152;

    // for now this is just mock data until we have the API
    this.eventMessages = [];

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

    this.isExistingStream = true;

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
    if (this.messageText === '') {
      return;
    }
    else {
      if(!this.myUser){
        console.error('user does not exist');
        return;
      }
      const message: IEventMessage = {
        text: this.messageText,
        timestamp: new Date().toISOString(),
        user: this.myUser,
      }
      this.socket.emit('message', message);
    }
    this.messageText = '';
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

  showEmojiMenu() {
    this.showEmojiPicker = !this.showEmojiPicker;
    // set height of scrollContainer to 40% with a smooth transition
    if (this.scrollContainer && this.showEmojiPicker) {
      this.scrollContainer.nativeElement.style.height = '40%';
      this.scrollContainer.nativeElement.style.transition = 'height 0.5s ease-in-out';
    }
    else if (this.scrollContainer && !this.showEmojiPicker) {
      this.scrollContainer.nativeElement.style.height = '85%';
      this.scrollContainer.nativeElement.style.transition = 'height 0.5s ease-in-out';
    }
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
    // const index = this.videoStreams.findIndex((stream) => stream.id === this.activeVideoStream.id);
    // if (index > 0) {
    //   this.activeVideoStream = this.videoStreams[index - 1];
    //   const videoElement = document.getElementById('video') as HTMLVideoElement;
    //   if (videoElement) {
    //     videoElement.load();
    //   }
    // }
    // else {
    //   this.activeVideoStream = this.videoStreams[this.videoStreams.length - 1];
    //   const videoElement = document.getElementById('video') as HTMLVideoElement;
    //   if (videoElement) {
    //     videoElement.load();
    //   }
    // }
    this.consumer_component.prevStream();
  }

  switchToNextStream(): void {
    // const index = this.videoStreams.findIndex((stream) => stream.id === this.activeVideoStream.id);
    // if (index < this.videoStreams.length - 1) {
    //   this.activeVideoStream = this.videoStreams[index + 1];
    //   const videoElement = document.getElementById('video') as HTMLVideoElement;
    //   if (videoElement) {
    //     videoElement.load();
    //   }
    // }
    // else {
    //   this.activeVideoStream = this.videoStreams[0];
    //   const videoElement = document.getElementById('video') as HTMLVideoElement;
    //   if (videoElement) {
    //     videoElement.load();
    //   }
    // }
    this.consumer_component.nextStream();
  }
}
