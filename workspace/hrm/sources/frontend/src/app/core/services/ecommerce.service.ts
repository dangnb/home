import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ProductItem, ProductCategory, OrderItem, CustomerItem } from '../models/ecommerce.model';

@Injectable({
  providedIn: 'root'
})
export class EcommerceService {
  private productsState = signal<ProductItem[]>([
    {
      id: '1',
      name: 'Wireless Bluetooth Headset 700',
      sku: '02458001',
      thumbnail: 'assets/media/stock/ecommerce/1.gif',
      qty: 58,
      price: 249.00,
      rating: 5,
      status: 'Published',
      statusColor: 'success',
      category: 'Electronics'
    },
    {
      id: '2',
      name: 'Smart Fitness Tracker Watch Pro',
      sku: '03891002',
      thumbnail: 'assets/media/stock/ecommerce/2.gif',
      qty: 120,
      price: 189.50,
      rating: 4,
      status: 'Published',
      statusColor: 'success',
      category: 'Wearables'
    },
    {
      id: '3',
      name: 'Ergonomic Mechanical Keyboard RGB',
      sku: '04128003',
      thumbnail: 'assets/media/stock/ecommerce/3.gif',
      qty: 0,
      price: 135.00,
      rating: 5,
      status: 'Inactive',
      statusColor: 'danger',
      category: 'Accessories'
    },
    {
      id: '4',
      name: 'Ultra HD 4K Action Camera 60FPS',
      sku: '05923004',
      thumbnail: 'assets/media/stock/ecommerce/4.gif',
      qty: 24,
      price: 320.00,
      rating: 4,
      status: 'Published',
      statusColor: 'success',
      category: 'Cameras'
    },
    {
      id: '5',
      name: 'Portable Bluetooth Bass Speaker',
      sku: '06812005',
      thumbnail: 'assets/media/stock/ecommerce/5.gif',
      qty: 15,
      price: 89.99,
      rating: 4,
      status: 'Scheduled',
      statusColor: 'warning',
      category: 'Audio'
    },
    {
      id: '6',
      name: 'Noise Cancelling Studio Headphones',
      sku: '07145006',
      thumbnail: 'assets/media/stock/ecommerce/6.gif',
      qty: 42,
      price: 299.00,
      rating: 5,
      status: 'Published',
      statusColor: 'success',
      category: 'Audio'
    },
    {
      id: '7',
      name: 'High-Precision Gaming Mouse 16000 DPI',
      sku: '08341007',
      thumbnail: 'assets/media/stock/ecommerce/7.gif',
      qty: 85,
      price: 69.50,
      rating: 4,
      status: 'Published',
      statusColor: 'success',
      category: 'Accessories'
    },
    {
      id: '8',
      name: 'Ultra-Slim Magnetic Powerbank 10000mAh',
      sku: '09124008',
      thumbnail: 'assets/media/stock/ecommerce/8.gif',
      qty: 6,
      price: 49.00,
      rating: 3,
      status: 'Scheduled',
      statusColor: 'warning',
      category: 'Power'
    }
  ]);

  private categoriesState = signal<ProductCategory[]>([
    {
      id: '1',
      name: 'Electronics',
      description: 'Mobile devices, audio hardware, and smart appliances',
      productCount: 48,
      icon: 'bi-phone',
      iconBg: 'primary'
    },
    {
      id: '2',
      name: 'Wearables',
      description: 'Smart watches, health bands, and connected wrist accessories',
      productCount: 24,
      icon: 'bi-smartwatch',
      iconBg: 'success'
    },
    {
      id: '3',
      name: 'Accessories',
      description: 'Keyboards, mice, docks, cables, and premium desk gear',
      productCount: 86,
      icon: 'bi-keyboard',
      iconBg: 'info'
    },
    {
      id: '4',
      name: 'Audio & Sound',
      description: 'Over-ear headphones, studio monitors, wireless earphones',
      productCount: 35,
      icon: 'bi-headphones',
      iconBg: 'warning'
    }
  ]);

  private ordersState = signal<OrderItem[]>([
    {
      id: '1',
      orderNumber: '#ORD-98241',
      customerName: 'Emma Smith',
      customerAvatar: 'assets/media/avatars/300-6.jpg',
      customerEmail: 'smith@kpmg.com',
      status: 'Delivered',
      statusColor: 'info',
      total: 349.00,
      date: '02 Mar 2026',
      paymentMethod: 'Mastercard (**** 4242)'
    },
    {
      id: '2',
      orderNumber: '#ORD-98240',
      customerName: 'Max Smith',
      customerAvatar: 'assets/media/avatars/300-1.jpg',
      customerEmail: 'max@kt.com',
      status: 'Completed',
      statusColor: 'success',
      total: 189.50,
      date: '01 Mar 2026',
      paymentMethod: 'Visa (**** 5890)'
    },
    {
      id: '3',
      orderNumber: '#ORD-98239',
      customerName: 'Sean Bean',
      customerAvatar: 'assets/media/avatars/300-5.jpg',
      customerEmail: 'sean@dellito.com',
      status: 'Processing',
      statusColor: 'primary',
      total: 540.00,
      date: '28 Feb 2026',
      paymentMethod: 'PayPal Express'
    },
    {
      id: '4',
      orderNumber: '#ORD-98238',
      customerName: 'Melody Macy',
      customerEmail: 'melody@altbox.com',
      status: 'Pending',
      statusColor: 'warning',
      total: 89.99,
      date: '27 Feb 2026',
      paymentMethod: 'Apple Pay'
    },
    {
      id: '5',
      orderNumber: '#ORD-98237',
      customerName: 'Brian Cox',
      customerAvatar: 'assets/media/avatars/300-25.jpg',
      customerEmail: 'brian@exchange.com',
      status: 'Cancelled',
      statusColor: 'danger',
      total: 299.00,
      date: '25 Feb 2026',
      paymentMethod: 'Visa (**** 1120)'
    }
  ]);

  private customersState = signal<CustomerItem[]>([
    {
      id: '1',
      name: 'Emma Smith',
      email: 'smith@kpmg.com',
      avatar: 'assets/media/avatars/300-6.jpg',
      status: 'Active',
      statusColor: 'success',
      country: 'United States',
      countryFlag: 'assets/media/flags/united-states.svg',
      ordersCount: 18,
      totalSpent: 4250.00,
      joinedDate: '25 Jul 2022, 5:20 pm'
    },
    {
      id: '2',
      name: 'Melody Macy',
      email: 'melody@altbox.com',
      initials: 'M',
      initialsColor: 'danger',
      status: 'Active',
      statusColor: 'success',
      country: 'Germany',
      countryFlag: 'assets/media/flags/germany.svg',
      ordersCount: 9,
      totalSpent: 1820.50,
      joinedDate: '25 Oct 2022, 9:23 pm'
    },
    {
      id: '3',
      name: 'Max Smith',
      email: 'max@kt.com',
      avatar: 'assets/media/avatars/300-1.jpg',
      status: 'Active',
      statusColor: 'success',
      country: 'United Kingdom',
      countryFlag: 'assets/media/flags/united-kingdom.svg',
      ordersCount: 26,
      totalSpent: 6790.00,
      joinedDate: '15 Apr 2022, 11:05 am'
    },
    {
      id: '4',
      name: 'Sean Bean',
      email: 'sean@dellito.com',
      avatar: 'assets/media/avatars/300-5.jpg',
      status: 'Locked',
      statusColor: 'warning',
      country: 'Australia',
      countryFlag: 'assets/media/flags/australia.svg',
      ordersCount: 3,
      totalSpent: 340.00,
      joinedDate: '10 Mar 2022, 6:05 pm'
    },
    {
      id: '5',
      name: 'Brian Cox',
      email: 'brian@exchange.com',
      avatar: 'assets/media/avatars/300-25.jpg',
      status: 'Active',
      statusColor: 'success',
      country: 'Japan',
      countryFlag: 'assets/media/flags/japan.svg',
      ordersCount: 12,
      totalSpent: 2940.00,
      joinedDate: '19 Aug 2022, 6:05 pm'
    },
    {
      id: '6',
      name: 'Mikaela Collins',
      email: 'mik@pex.com',
      initials: 'C',
      initialsColor: 'warning',
      status: 'Disabled',
      statusColor: 'danger',
      country: 'France',
      countryFlag: 'assets/media/flags/france.svg',
      ordersCount: 1,
      totalSpent: 89.00,
      joinedDate: '20 Jun 2022, 8:43 pm'
    }
  ]);

  getProducts(): Observable<ProductItem[]> {
    return of(this.productsState());
  }

  getCategories(): Observable<ProductCategory[]> {
    return of(this.categoriesState());
  }

  getOrders(): Observable<OrderItem[]> {
    return of(this.ordersState());
  }

  getCustomers(): Observable<CustomerItem[]> {
    return of(this.customersState());
  }

  addCustomer(customer: Omit<CustomerItem, 'id' | 'statusColor' | 'joinedDate'>): void {
    const statusColor = customer.status === 'Active' ? 'success' : customer.status === 'Locked' ? 'warning' : 'danger';
    const newCustomer: CustomerItem = {
      ...customer,
      id: (this.customersState().length + 1).toString(),
      joinedDate: 'Just now',
      statusColor
    };
    this.customersState.update(list => [newCustomer, ...list]);
  }

  deleteCustomer(id: string): void {
    this.customersState.update(list => list.filter(c => c.id !== id));
  }

  deleteCustomers(ids: string[]): void {
    const set = new Set(ids);
    this.customersState.update(list => list.filter(c => !set.has(c.id)));
  }

  addProduct(product: Omit<ProductItem, 'id' | 'statusColor'>): void {
    const statusColor = product.status === 'Published' ? 'success' : product.status === 'Scheduled' ? 'warning' : 'danger';
    const newProduct: ProductItem = {
      ...product,
      id: (this.productsState().length + 1).toString(),
      statusColor
    };
    this.productsState.update(list => [newProduct, ...list]);
  }

  deleteProduct(id: string): void {
    this.productsState.update(list => list.filter(p => p.id !== id));
  }

  deleteProducts(ids: string[]): void {
    const set = new Set(ids);
    this.productsState.update(list => list.filter(p => !set.has(p.id)));
  }
}
