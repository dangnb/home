export interface Subscription {
  id: string;
  customerName: string;
  customerEmail: string;
  avatar?: string;
  initials?: string;
  initialsColor?: string;
  status: 'Active' | 'Expiring' | 'Suspended';
  billing: 'Auto-debit' | 'Manual - Credit Card' | 'Manual - Paypal';
  product: 'Basic' | 'Basic Bundle' | 'Teams' | 'Enterprise';
  price: string;
  createdDate: string;
  selected?: boolean;
}
