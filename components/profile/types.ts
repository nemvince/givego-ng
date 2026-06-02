export type Profile = {
  id: string;
  userId: string;
  accountType: "person" | "organization";
  orgName: string | null;
  registrationNumber: string | null;
  contactName: string | null;
  contactPhone: string | null;
  website: string | null;
  description: string | null;
  logo: string | null;
  socialLinks: string | null;
  showContactName: boolean;
  showContactPhone: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export type UserSettings = {
  id: number;
  userId: string;
  emailNotifications: boolean;
  inAppNotifications: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Passkey = {
  id: string;
  name: string | null;
  userId: string;
  credentialID: string;
  counter: number;
  deviceType: string;
  backedUp: boolean;
  transports: string | null;
  createdAt: Date | null;
  aaguid: string | null;
};
