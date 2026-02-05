export interface SponsorEntity {
  id: number;
  name: string;
  sponsorType?: string;
  level: string;
  link?: string;
  darkLogo?: string;
  lightLogo?: string;
  order: number;
  hackathonId?: string;
}
