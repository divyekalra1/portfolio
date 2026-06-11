export interface SeriesMeta {
  id: 'htb-cpts' | 'aws' | 'projects';
  name: string;
  blurb: string;
}

export const series: Record<SeriesMeta['id'], SeriesMeta> = {
  'htb-cpts': {
    id: 'htb-cpts',
    name: 'HackTheBox CPTS',
    blurb:
      'Working notes from the HTB Certified Penetration Testing Specialist path — recon, web attacks, services, and the boxes pwned along the way.',
  },
  projects: {
    id: 'projects',
    name: 'Projects',
    blurb:
      'Deep dives into things I built or broke: binary exploitation, supply-chain security, and homelab engineering.',
  },
  aws: {
    id: 'aws',
    name: 'AWS Cloud Practitioner',
    blurb: 'Condensed notes from preparing for the AWS Cloud Practitioner certification.',
  },
};

export const seriesOrder: SeriesMeta['id'][] = ['projects', 'htb-cpts', 'aws'];
