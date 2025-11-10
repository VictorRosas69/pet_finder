import { PetStatus, PetType, UserRole, NotificationType, ReportType } from './enums';

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  country?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Pet {
  id: string;
  ownerId: string;
  name: string;
  type: PetType;
  breed?: string;
  color?: string;
  age?: number;
  description?: string;
  photos: string[];
  qrCode: string;
  microchipId?: string;
  status: PetStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Report {
  id: string;
  petId?: string;
  reporterId: string;
  type: ReportType;
  location: Location;
  description: string;
  photos: string[];
  contactInfo: {
    name: string;
    phone?: string;
    email?: string;
  };
  status: 'ACTIVE' | 'RESOLVED' | 'CLOSED';
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: Date;
}

export interface GeofenceAlert {
  id: string;
  petId: string;
  userId: string;
  location: Location;
  radius: number;
  active: boolean;
  createdAt: Date;
}
