import { AfterViewInit, Component, HostListener, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgIconsModule } from '@ng-icons/core';
import { AppApiService } from '@event-participation-trends/app/api';

@Component({
  selector: 'event-participation-trends-chat-message',
  standalone: true,
  imports: [CommonModule, NgIconsModule, FormsModule],
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.css'],
})
export class ChatMessageComponent implements OnInit, AfterViewInit{
  @Input() message = {
    id: 0,
    text: '',
    timestamp: '',
    user: {
      id: '0',
      name: '',
      profilePic: '',
      email: '',
    },
  };
  @Input() prevMessageSameUser = false;
  @Input() nextMessageSameUser = false;
  @Input() isUserEventManager = false;
  @Input() activeUserID = '';
  @Input() isFirstMessageOfTheDay = false;
  @Input() messageDate = '';
  @Input() isFirstMessageOfEvent = false;
  messageDigitalTime = '';
  activeUserEmail = '';
  isLargeScreen = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isLargeScreen = event.target.innerWidth > 1152;
  }

  constructor(private appApiService: AppApiService) {
    this.appApiService.getEmail().then((email) => {
      this.activeUserEmail = email;
    });
    this.messageDigitalTime = this.convertTimestampToDigitalTime(this.message.timestamp);
  }

  ngOnInit() {
    this.isLargeScreen = window.innerWidth > 1152;
  }

  ngAfterViewInit() {
    this.isLargeScreen = window.innerWidth > 1152;
  }

  convertTimestampToDigitalTime(timestamp: string): string {
    try {
      const date = new Date(timestamp);
      
      // Include this if you want to throw an error if the timestamp is invalid
      // if (isNaN(date.getTime())) {
      //   throw new Error('Invalid time for date');
      // }
      
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const hoursString = hours < 10 ? '0' + hours : hours.toString();
      const minutesString = minutes < 10 ? '0' + minutes : minutes.toString();
      
      const strTime = hoursString + ':' + minutesString;
      
      return strTime;
    } catch (error) {
      console.error('Error converting timestamp:', error);
      return 'Invalid Timestamp';
    }
  }


}
