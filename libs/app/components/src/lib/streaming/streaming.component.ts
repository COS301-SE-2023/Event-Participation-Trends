import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconsModule, provideIcons } from '@ng-icons/core';
import { matSend, matChat, matClose } from '@ng-icons/material-icons/baseline';
import { heroFaceSmileSolid, heroVideoCameraSlashSolid } from '@ng-icons/heroicons/solid';
import { AppApiService } from '@event-participation-trends/app/api';

@Component({
  selector: 'event-participation-trends-streaming',
  standalone: true,
  imports: [CommonModule, NgIconsModule],
  templateUrl: './streaming.component.html',
  styleUrls: ['./streaming.component.css'],
  providers: [
    provideIcons({matSend, heroFaceSmileSolid, matChat, matClose, heroVideoCameraSlashSolid})
  ]
})
export class StreamingComponent implements OnInit {
  message = '';
  eventMessages = null; // this will change to an array of eventMessage objects
  videoStreams = null; // this will change to an array of videoStream objects
  showEmojiPicker = false;
  isLargeScreen = false;
  chatToggled = false;
  showChat = false;

  constructor(private appApiService: AppApiService) { }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isLargeScreen = event.target.innerWidth > 1152;
  }

  async ngOnInit() {
    this.isLargeScreen = window.innerWidth > 1152;
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
}
