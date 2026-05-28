export interface Room {
  id: string;
  name: string;
  type: string;
  price: number;
  image: string;
  gallery: string[];
  rating: number;
  size: number;
  maxGuests: number;
  view: string;
  description: string;
  amenities: string[];
}

export interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  guestName: string;
  guestEmail: string;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'rejected' | 'cancelled';
  specialRequests: string;
  createdAt: string;
}

export interface AdminUser {
  token: string;
  email: string;
  name: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}
