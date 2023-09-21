import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconsModule, provideIcons } from '@ng-icons/core';
import { matSend, matChat, matClose, matArrowLeft, matArrowRight } from '@ng-icons/material-icons/baseline';
import { heroFaceSmileSolid, heroVideoCameraSlashSolid } from '@ng-icons/heroicons/solid';
import { AppApiService } from '@event-participation-trends/app/api';
import { FormsModule } from '@angular/forms';

interface VideoStream {
  id: number;
  name: string;
  url: string;
}
@Component({
  selector: 'event-participation-trends-streaming',
  standalone: true,
  imports: [CommonModule, NgIconsModule, FormsModule],
  templateUrl: './streaming.component.html',
  styleUrls: ['./streaming.component.css'],
  providers: [
    provideIcons({matSend, heroFaceSmileSolid, matChat, matClose, heroVideoCameraSlashSolid, matArrowLeft, matArrowRight})
  ]
})
export class StreamingComponent implements OnInit {
  message = '';
  eventMessages: any = null; // this will change to an array of eventMessage objects
  videoStreams!:VideoStream[]; // this will change to an array of videoStream objects
  activeVideoStream:any = null; // this will change to a videoStream object
  showEmojiPicker = false;
  isLargeScreen = false;
  chatToggled = false;
  showChat = false;
  isDropdownOpen = false;
  showArrows = false;
  timer: any;

  constructor(private appApiService: AppApiService) { }

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
    this.isLargeScreen = window.innerWidth > 1152;

    // for now this is just mock data until we have the API
    this.eventMessages = [
      {
        id: 1,
        message: 'Hello world!',
        timestamp: '2021-07-01T12:00:00.000Z',
        user: {
          id: 1,
          name: 'John Doe',
        },
        profilePic: 'url',
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
  }

  get filteredStreams(): VideoStream[] {
    return this.videoStreams.filter((stream) => stream.id !== this.activeVideoStream.id);
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  sendMessage() {
    console.log('Sending message: ', this.message);
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
    const element = document.getElementById('chatMenu');
    if (element) {
      element.style.width = '400px';
    }
  }

  showEmojiMenu() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  onStreamChange(event: any): void {
    this.filteredStreams.forEach((stream) => {
      if (stream.id === event.target.id) {
        this.activeVideoStream = stream;
        const videoElement = document.getElementById('video') as HTMLVideoElement;
        if (videoElement) {
          videoElement.src = stream.url;
          videoElement.load();
        }
      }
    });
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

  switchToPreviousStream(): void {
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
}
