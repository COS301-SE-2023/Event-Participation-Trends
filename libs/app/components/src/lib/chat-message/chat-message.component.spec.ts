import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatMessageComponent } from './chat-message.component';
import { NgIconsModule, provideIcons } from '@ng-icons/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ChatMessageComponent', () => {
  let component: ChatMessageComponent;
  let fixture: ComponentFixture<ChatMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatMessageComponent, NgIconsModule, HttpClientTestingModule],
      providers: [
        provideIcons({})
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ChatMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
