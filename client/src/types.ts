export interface FormData {
  avatar?: string;
}

export interface Listing {
  _id: string;
  name: string;
  description: string;
  address: string;
  regularPrice: number;
  discountedPrice: number;
  bathrooms: number;
  bedrooms: number;
  furnished: boolean;
  parking: boolean;
  type: string;
  pets: boolean;
  offer: boolean;
  imageUrls: string[];
  userRef: string;
  createdAt: string;
  updatedAt: string;
}
