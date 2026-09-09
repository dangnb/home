import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DrawerService } from '../../../core/services/drawer.service';
import { AuthService } from '../../../core/services/auth.service';

interface ChatMessage {
  id: string;
  sender: 'in' | 'out';
  author: string;
  avatar: string;
  time: string;
  text: string;
}

@Component({
  selector: 'app-chat-drawer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-drawer.component.html',
  styleUrls: ['./chat-drawer.component.scss']
})
export class ChatDrawerComponent {
  readonly drawerService = inject(DrawerService);
  readonly authService = inject(AuthService);

  readonly messageText = signal<string>('');

  readonly messages = signal<ChatMessage[]>([
    {
      id: '1',
      sender: 'in',
      author: 'Brian Cox',
      avatar: 'assets/media/avatars/300-25.jpg',
      time: '2 mins ago',
      text: 'How likely are you to recommend our company to your friends and family?'
    },
    {
      id: '2',
      sender: 'out',
      author: 'You',
      avatar: 'assets/media/avatars/300-1.jpg',
      time: '5 mins ago',
      text: 'Hey there, we’re just writing to let you know that you’ve been subscribed to a repository on GitHub.'
    },
    {
      id: '3',
      sender: 'in',
      author: 'Brian Cox',
      avatar: 'assets/media/avatars/300-25.jpg',
      time: '1 hour ago',
      text: 'Ok, understood! We will proceed with the Sprint 4 milestone planning.'
    },
    {
      id: '4',
      sender: 'out',
      author: 'You',
      avatar: 'assets/media/avatars/300-1.jpg',
      time: '2 hours ago',
      text: 'You’ll receive automated notifications for all issues and pull requests!'
    }
  ]);

  sendMessage(): void {
    const text = this.messageText().trim();
    if (!text) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'out',
      author: this.authService.currentUser()?.name || 'You',
      avatar: this.authService.currentUser()?.avatar || 'assets/media/avatars/300-1.jpg',
      time: 'Just now',
      text
    };

    this.messages.update(list => [...list, newMsg]);
    this.messageText.set('');

    // Optional simulated reply after 1s
    setTimeout(() => {
      const replyMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'in',
        author: 'Brian Cox',
        avatar: 'assets/media/avatars/300-25.jpg',
        time: 'Just now',
        text: 'Got it! Thanks for the update.'
      };
      this.messages.update(list => [...list, replyMsg]);
    }, 1200);
  }

  close(): void {
    this.drawerService.closeChat();
  }
}
