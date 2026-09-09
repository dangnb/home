import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

interface ProfileProject {
  id: string;
  name: string;
  category: string;
  budget: string;
  progress: number;
  status: 'In Progress' | 'Completed' | 'Pending';
  statusColor: 'primary' | 'success' | 'warning' | 'danger';
  team: string[];
}

interface FeedPost {
  id: string;
  author: string;
  authorAvatar: string;
  authorRole: string;
  timeAgo: string;
  content: string;
  likes: number;
  commentsCount: number;
  liked: boolean;
  image?: string;
}

@Component({
  selector: 'app-profile-overview',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './profile-overview.component.html',
  styleUrls: ['./profile-overview.component.scss']
})
export class ProfileOverviewComponent {
  readonly authService = inject(AuthService);

  readonly activeTab = signal<'overview' | 'projects' | 'campaigns' | 'documents' | 'followers' | 'activity'>('overview');
  readonly isFollowing = signal<boolean>(false);
  readonly newPostText = signal<string>('');

  readonly projects = signal<ProfileProject[]>([
    {
      id: '1',
      name: 'Si-Fi Web Platform Redesign',
      category: 'Web Development',
      budget: '$34,500',
      progress: 78,
      status: 'In Progress',
      statusColor: 'primary',
      team: ['300-1.jpg', '300-2.jpg', '300-3.jpg', '300-6.jpg']
    },
    {
      id: '2',
      name: 'Mobile Banking iOS & Android',
      category: 'Mobile Apps',
      budget: '$89,000',
      progress: 100,
      status: 'Completed',
      statusColor: 'success',
      team: ['300-6.jpg', '300-9.jpg', '300-14.jpg']
    },
    {
      id: '3',
      name: 'CRM Microservices Integration',
      category: 'Cloud Infrastructure',
      budget: '$21,800',
      progress: 45,
      status: 'Pending',
      statusColor: 'warning',
      team: ['300-11.jpg', '300-1.jpg']
    },
    {
      id: '4',
      name: 'Data Analytics AI Engine',
      category: 'Artificial Intelligence',
      budget: '$120,000',
      progress: 60,
      status: 'In Progress',
      statusColor: 'primary',
      team: ['300-2.jpg', '300-14.jpg', '300-6.jpg']
    }
  ]);

  readonly feedPosts = signal<FeedPost[]>([
    {
      id: '1',
      author: 'Max Smith',
      authorAvatar: 'assets/media/avatars/300-1.jpg',
      authorRole: 'Lead Architect',
      timeAgo: '1 day ago',
      content: 'Outlines keep you honest. They stop you from rambling on about drive and keep the focus squarely on delivering value to clients and team members! 🚀',
      likes: 24,
      commentsCount: 5,
      liked: false,
      image: 'assets/media/stock/600x400/img-1.jpg'
    },
    {
      id: '2',
      author: 'Karina Clark',
      authorAvatar: 'assets/media/avatars/300-6.jpg',
      authorRole: 'Marketing Manager',
      timeAgo: '2 days ago',
      content: 'Excited to announce that the new product launch campaign reached 150k impressions in the first 48 hours! Thank you everyone on the creative team. 🎉',
      likes: 48,
      commentsCount: 12,
      liked: true
    }
  ]);

  setTab(tab: 'overview' | 'projects' | 'campaigns' | 'documents' | 'followers' | 'activity'): void {
    this.activeTab.set(tab);
  }

  toggleFollow(): void {
    this.isFollowing.update(v => !v);
  }

  toggleLike(post: FeedPost): void {
    if (post.liked) {
      post.likes--;
      post.liked = false;
    } else {
      post.likes++;
      post.liked = true;
    }
  }

  createPost(): void {
    const text = this.newPostText().trim();
    if (!text) return;

    const newPost: FeedPost = {
      id: Date.now().toString(),
      author: this.authService.currentUser()?.name || 'Max Smith',
      authorAvatar: this.authService.currentUser()?.avatar || 'assets/media/avatars/300-1.jpg',
      authorRole: 'Developer',
      timeAgo: 'Just now',
      content: text,
      likes: 0,
      commentsCount: 0,
      liked: false
    };

    this.feedPosts.update(posts => [newPost, ...posts]);
    this.newPostText.set('');
  }
}
