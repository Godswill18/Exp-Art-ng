export interface User {
  name: string;
  email: string;
  role: string;
}

export interface Transaction {
  id: string;
  user: string;
  amount: number;
  date: string;
  status: 'Success' | 'Pending' | 'Failed';
  email: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  image: string;
}
