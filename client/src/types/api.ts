/** Shapes returned by the public endpoints of https://api.experiencenigeriaart.com. */

export interface EventItem {
  _id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  ticketType: string;
  price: number | string;
  image?: string;
  isActive?: boolean;
}

export interface GalleryItem {
  _id?: string;
  title: string;
  image: string;
  description: string;
}

export interface EventDay {
  _id?: string;
  day: string;
  date: string;
  activities: string;
  description?: string;
}
