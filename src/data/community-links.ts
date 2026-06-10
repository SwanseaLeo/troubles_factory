export type CommunityLinkType = 'discord' | 'telegram' | 'external';

export interface CommunityLink {
  name: string;
  description?: string;
  url: string;
  type: CommunityLinkType;
}

export const communityLinks: CommunityLink[] = [
  {
    name: 'Discord',
    description: 'Join our server',
    url: 'https://discord.gg/NgeWgGnF',
    type: 'discord',
  },
];
