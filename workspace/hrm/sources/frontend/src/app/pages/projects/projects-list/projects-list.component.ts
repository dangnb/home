import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

export interface ProjectItem {
  id: string;
  name: string;
  category: string;
  logo?: string;
  logoBg?: string;
  description: string;
  dueDate: string;
  budget: string;
  progress: number;
  progressColor: string;
  status: 'In Progress' | 'Completed' | 'On Hold' | 'Overdue';
  statusColor: string;
  members: { name: string; avatar?: string; initials?: string; color?: string }[];
}

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.scss']
})
export class ProjectsListComponent {
  activeTab: 'All' | 'In Progress' | 'Completed' | 'On Hold' = 'All';
  searchTerm = '';

  // New Project Modal
  isNewModalOpen = false;
  newProjectName = '';
  newProjectCategory = 'Web Development';
  newProjectBudget = '$25,000';
  newProjectDueDate = 'Dec 20, 2026';
  newProjectDescription = '';

  projects: ProjectItem[] = [
    {
      id: 'PRJ-1',
      name: 'eCommerce Mobile App',
      category: 'Mobile App',
      logo: 'assets/media/svg/brand-logos/amazon.svg',
      logoBg: 'light',
      description: 'Native iOS & Android mobile shopping experience with instant payment gateway.',
      dueDate: 'Nov 15, 2026',
      budget: '$64,500',
      progress: 68,
      progressColor: 'primary',
      status: 'In Progress',
      statusColor: 'primary',
      members: [
        { name: 'Emma Smith', avatar: 'assets/media/avatars/300-6.jpg' },
        { name: 'Francis Mitcham', avatar: 'assets/media/avatars/300-9.jpg' },
        { name: 'Dan Wilson', initials: 'D', color: 'success' }
      ]
    },
    {
      id: 'PRJ-2',
      name: 'CRM Dashboard Redesign',
      category: 'UI/UX Design',
      logo: 'assets/media/svg/brand-logos/figma-icon.svg',
      logoBg: 'light',
      description: 'Modern glassmorphic analytics dashboard with multi-tenant workspace architecture.',
      dueDate: 'Oct 30, 2026',
      budget: '$32,000',
      progress: 100,
      progressColor: 'success',
      status: 'Completed',
      statusColor: 'success',
      members: [
        { name: 'Max Smith', avatar: 'assets/media/avatars/300-1.jpg' },
        { name: 'Sean Bean', avatar: 'assets/media/avatars/300-5.jpg' }
      ]
    },
    {
      id: 'PRJ-3',
      name: 'Cloud Microservices Migration',
      category: 'Cloud Architecture',
      logo: 'assets/media/svg/brand-logos/google-icon.svg',
      logoBg: 'light',
      description: 'Kubernetes containerization and zero-downtime deployment pipeline implementation.',
      dueDate: 'Jan 10, 2027',
      budget: '$120,000',
      progress: 45,
      progressColor: 'warning',
      status: 'In Progress',
      statusColor: 'primary',
      members: [
        { name: 'Brian Cox', avatar: 'assets/media/avatars/300-25.jpg' },
        { name: 'Melody Macy', avatar: 'assets/media/avatars/300-2.jpg' },
        { name: 'Olivia Wild', initials: 'O', color: 'danger' }
      ]
    },
    {
      id: 'PRJ-4',
      name: 'FinTech Banking Gateway',
      category: 'Security & Compliance',
      logo: 'assets/media/svg/brand-logos/slack-icon.svg',
      logoBg: 'light',
      description: 'PCI-DSS certified secure payment transaction processing engine with fraud detection.',
      dueDate: 'Sep 25, 2026',
      budget: '$88,000',
      progress: 20,
      progressColor: 'danger',
      status: 'On Hold',
      statusColor: 'warning',
      members: [
        { name: 'Mikaela Collins', initials: 'M', color: 'info' },
        { name: 'Francis Mitcham', avatar: 'assets/media/avatars/300-9.jpg' }
      ]
    },
    {
      id: 'PRJ-5',
      name: 'AI Smart Search Engine',
      category: 'Machine Learning',
      logo: 'assets/media/svg/brand-logos/github.svg',
      logoBg: 'light',
      description: 'Vector embeddings semantic retrieval with sub-second hybrid neural search latency.',
      dueDate: 'Feb 18, 2027',
      budget: '$95,000',
      progress: 55,
      progressColor: 'info',
      status: 'In Progress',
      statusColor: 'primary',
      members: [
        { name: 'Max Smith', avatar: 'assets/media/avatars/300-1.jpg' },
        { name: 'Emma Smith', avatar: 'assets/media/avatars/300-6.jpg' }
      ]
    },
    {
      id: 'PRJ-6',
      name: 'Internal HR Portal',
      category: 'Enterprise Suite',
      logo: 'assets/media/svg/brand-logos/twitter.svg',
      logoBg: 'light',
      description: 'Automated employee onboarding, leave tracking, and 360-degree performance review.',
      dueDate: 'Aug 14, 2026',
      budget: '$28,000',
      progress: 100,
      progressColor: 'success',
      status: 'Completed',
      statusColor: 'success',
      members: [
        { name: 'Dan Wilson', initials: 'D', color: 'success' },
        { name: 'Sean Bean', avatar: 'assets/media/avatars/300-5.jpg' }
      ]
    }
  ];

  get filteredProjects(): ProjectItem[] {
    let list = this.projects;

    if (this.activeTab !== 'All') {
      list = list.filter(p => p.status === this.activeTab);
    }

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
      );
    }

    return list;
  }

  setTab(tab: 'All' | 'In Progress' | 'Completed' | 'On Hold'): void {
    this.activeTab = tab;
  }

  createProject(): void {
    if (!this.newProjectName) {
      alert('Please enter a project name.');
      return;
    }

    const newPrj: ProjectItem = {
      id: `PRJ-${this.projects.length + 1}`,
      name: this.newProjectName,
      category: this.newProjectCategory,
      logo: 'assets/media/svg/brand-logos/google-icon.svg',
      logoBg: 'light',
      description: this.newProjectDescription || 'Brand new project initialized.',
      dueDate: this.newProjectDueDate,
      budget: this.newProjectBudget,
      progress: 5,
      progressColor: 'primary',
      status: 'In Progress',
      statusColor: 'primary',
      members: [
        { name: 'Max Smith', avatar: 'assets/media/avatars/300-1.jpg' }
      ]
    };

    this.projects.unshift(newPrj);
    this.isNewModalOpen = false;
    this.newProjectName = '';
    this.newProjectDescription = '';
  }
}
