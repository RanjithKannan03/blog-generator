import fintechRows from './fintechRows.json'

import type { Blog, CompanyRow } from '#shared/types/blog'

// temp placeholder data
export const sampleBlogs: Blog[] = [
  {
    id: 'k7p2x9qa',
    slug: 'top-100-uk-fintech-companies',
    title: 'Top 100 UK Fintech Companies by Funding (2026)',
    category: 'Fintech',
    rowCount: 100,
    createdAt: '2026-10-29T10:00:00Z',
    metaDescription:
      'Discover the 100 best-funded fintech companies in the UK, ranked by total raised, with regional and sector insights.',
    introduction:
      'These are the 100 UK fintech companies that have raised the most funding. The ranking covers payments, wealth management, compliance and more, and shows where fintech investment is concentrated.',
    stats: {
      highlights: [
        { label: 'Total raised', value: 622301270, format: 'money', note: 'Across all 100 companies' },
        { label: 'Median raised', value: 4146786, format: 'money', note: 'Half raised more, half less' },
        { label: 'Largest raise', value: 30314247, format: 'money', note: 'Nevis, ranked #1' },
        { label: 'Based in London', value: 78, format: 'percent', note: '78 of 100 companies' },
      ],
      grouping: {
        label: 'Industry',
        groups: [
          {
            label: 'Data provision and analysis',
            highlights: [
              { label: 'Companies', value: 35, format: 'number', note: '35 of the top 100' },
              { label: 'Total raised', value: 227502526, format: 'money' },
              { label: 'Median raised', value: 5000000, format: 'money' },
              { label: 'Largest raise', value: 27949436, format: 'money', note: 'Januus.io, ranked #2' },
            ],
          },
          {
            label: 'Wealth, asset and investment management',
            highlights: [
              { label: 'Companies', value: 27, format: 'number', note: '27 of the top 100' },
              { label: 'Total raised', value: 191022843, format: 'money' },
              { label: 'Median raised', value: 5172607, format: 'money' },
              { label: 'Largest raise', value: 30314247, format: 'money', note: 'Nevis, ranked #1' },
            ],
          },
          {
            label: 'Budgeting and financial management',
            highlights: [
              { label: 'Companies', value: 24, format: 'number', note: '24 of the top 100' },
              { label: 'Total raised', value: 145210272, format: 'money' },
              { label: 'Median raised', value: 5179532, format: 'money' },
              { label: 'Largest raise', value: 24222973, format: 'money', note: 'Adfin, ranked #3' },
            ],
          },
          {
            label: 'Payment processing',
            highlights: [
              { label: 'Companies', value: 24, format: 'number', note: '24 of the top 100' },
              { label: 'Total raised', value: 172397030, format: 'money' },
              { label: 'Median raised', value: 5374148, format: 'money' },
              { label: 'Largest raise', value: 24222973, format: 'money', note: 'Adfin, ranked #3' },
            ],
          },
          {
            label: 'Banking',
            highlights: [
              { label: 'Companies', value: 20, format: 'number', note: '20 of the top 100' },
              { label: 'Total raised', value: 139679050, format: 'money' },
              { label: 'Median raised', value: 5500989, format: 'money' },
              { label: 'Largest raise', value: 23665662, format: 'money', note: 'TreeCard, ranked #4' },
            ],
          },
          {
            label: 'Investment banking and corporate finance',
            highlights: [
              { label: 'Companies', value: 20, format: 'number', note: '20 of the top 100' },
              { label: 'Total raised', value: 82836913, format: 'money' },
              { label: 'Median raised', value: 2954416, format: 'money' },
              { label: 'Largest raise', value: 15220000, format: 'money', note: 'capsa.ai, ranked #9' },
            ],
          },
        ],
      },
      breakdowns: [
        {
          label: 'Companies by region',
          total: 100,
          items: [
            { label: 'London', count: 78 },
            { label: 'North West', count: 6 },
            { label: 'South West', count: 5 },
            { label: 'East of England', count: 3 },
            { label: 'Other', count: 8 },
          ],
        },
        {
          label: 'Companies by team size',
          total: 100,
          items: [
            { label: '<5', count: 11 },
            { label: '5-9', count: 23 },
            { label: '10-24', count: 49 },
            { label: '25-49', count: 10 },
            { label: '50-99', count: 2 },
            { label: 'Unknown', count: 3 },
          ],
        },
        {
          label: 'Top industries',
          total: 100,
          note: 'Companies can belong to several industries, so percentages add up to more than 100%.',
          items: [
            { label: 'Data provision and analysis', count: 35 },
            { label: 'Wealth, asset and investment management', count: 27 },
            { label: 'Budgeting and financial management', count: 24 },
            { label: 'Payment processing', count: 24 },
            { label: 'Banking', count: 20 },
            { label: 'Investment banking and corporate finance', count: 20 },
          ],
        },
      ],
    },
    table: {
      rankKey: 'rank',
      nameKey: 'company',
      metricKey: 'totalRaised',
      descriptionKey: 'description',
      columns: [
        { key: 'rank', label: 'Rank', type: 'number', showInTable: true },
        { key: 'company', label: 'Company', type: 'text', showInTable: true },
        { key: 'region', label: 'Region', type: 'text', showInTable: true },
        { key: 'employees', label: 'Employees', type: 'range', showInTable: true },
        { key: 'totalRaised', label: 'Total raised', type: 'money', showInTable: true },
        { key: 'stage', label: 'Stage', type: 'text', showInTable: false },
        { key: 'description', label: 'Description', type: 'text', showInTable: false },
        { key: 'website', label: 'Website', type: 'url', showInTable: false },
        { key: 'industries', label: 'Industries', type: 'list', showInTable: false },
      ],
      rows: fintechRows as CompanyRow[],
    },
    sections: [
      {
        heading: 'Which UK fintech companies have raised the most?',
        paragraphs: [
          'The top of the ranking is led by companies building AI platforms for wealth management and identity data for digital assets.',
          'Funding is heavily concentrated: a small group at the top accounts for a large share of the total raised.',
        ],
      },
      {
        heading: 'Where are the top UK fintechs based?',
        paragraphs: [
          'London dominates the list, but several companies are based in other regional hubs across the UK.',
        ],
      },
      {
        heading: 'Which fintech sectors attract the most funding?',
        paragraphs: [
          'Application software and payment processing appear most often, followed by risk and compliance tools.',
        ],
      },
    ],
  },
  {
    id: 'm3d8r1wz',
    slug: 'top-50-uk-healthtech-companies',
    title: 'Top 50 UK Healthtech Companies to Watch (2026)',
    category: 'Healthtech',
    rowCount: 50,
    createdAt: '2026-10-27T14:30:00Z',
    metaDescription:
      'The 50 UK healthtech companies to watch, ranked by funding, covering digital health, diagnostics and medtech.',
    introduction:
      'This ranking lists 50 UK healthtech companies by total funding raised, from digital health platforms to diagnostics.',
    stats: {
      highlights: [
        { label: 'Total raised', value: 418500000, format: 'money' },
        { label: 'Median raised', value: 5200000, format: 'money' },
        { label: 'Companies', value: 50, format: 'number' },
        { label: 'Based in London', value: 54, format: 'percent', note: '27 of 50 companies' },
      ],
      breakdowns: [
        {
          label: 'Companies by region',
          total: 50,
          items: [
            { label: 'London', count: 27 },
            { label: 'East of England', count: 11 },
            { label: 'South East', count: 7 },
            { label: 'Other', count: 5 },
          ],
        },
      ],
    },
    sections: [
      {
        heading: 'Which healthtech companies lead the ranking?',
        paragraphs: ['Diagnostics and remote monitoring companies feature strongly at the top.'],
      },
      {
        heading: 'Where is UK healthtech investment going?',
        paragraphs: ['London, Oxford and Cambridge host most of the companies on the list.'],
      },
    ],
  },
  {
    id: 'q9t4n6bc',
    slug: 'top-75-uk-cleantech-companies',
    title: 'Top 75 UK Cleantech Companies by Funding Raised',
    category: 'Cleantech',
    rowCount: 75,
    createdAt: '2026-10-24T09:15:00Z',
    metaDescription:
      'The 75 best-funded UK cleantech companies, ranked by total raised, across energy, storage and sustainability.',
    introduction:
      'These 75 UK cleantech companies have raised the most funding, spanning renewable energy, battery storage and carbon reduction.',
    stats: {
      highlights: [
        { label: 'Total raised', value: 512750000, format: 'money' },
        { label: 'Median raised', value: 4800000, format: 'money' },
        { label: 'Companies', value: 75, format: 'number' },
      ],
      breakdowns: [
        {
          label: 'Companies by region',
          total: 75,
          items: [
            { label: 'London', count: 31 },
            { label: 'Scotland', count: 14 },
            { label: 'South West', count: 12 },
            { label: 'North East', count: 9 },
            { label: 'Other', count: 9 },
          ],
        },
      ],
    },
    sections: [
      {
        heading: 'Which cleantech sectors raise the most?',
        paragraphs: ['Energy storage and grid technology companies attract the largest rounds.'],
      },
    ],
  },
  {
    id: 'v2h5j8ls',
    slug: 'top-100-uk-ai-companies',
    title: 'Top 100 UK AI Companies: Funding, Growth and Hubs',
    category: 'AI',
    rowCount: 100,
    createdAt: '2026-10-20T16:45:00Z',
    metaDescription:
      'The 100 best-funded UK AI companies, with insights on funding, company growth and regional hubs.',
    introduction:
      'This list ranks 100 UK AI companies by funding raised and looks at where they are based and how fast they are growing.',
    stats: {
      highlights: [
        { label: 'Total raised', value: 1240000000, format: 'money' },
        { label: 'Median raised', value: 7600000, format: 'money' },
        { label: 'Based in London', value: 71, format: 'percent', note: '71 of 100 companies' },
      ],
      breakdowns: [
        {
          label: 'Companies by region',
          total: 100,
          items: [
            { label: 'London', count: 71 },
            { label: 'East of England', count: 12 },
            { label: 'South East', count: 8 },
            { label: 'Other', count: 9 },
          ],
        },
      ],
    },
    sections: [
      {
        heading: 'Which UK AI companies have raised the most?',
        paragraphs: ['Foundation model and AI infrastructure companies lead the ranking.'],
      },
    ],
  },
  {
    id: 'f6c1y3ue',
    slug: 'top-40-uk-edtech-companies',
    title: 'Top 40 UK Edtech Companies Ranked by Investment',
    category: 'Edtech',
    rowCount: 40,
    createdAt: '2026-10-15T11:00:00Z',
    metaDescription:
      'The 40 UK edtech companies with the most investment, from learning platforms to school software.',
    introduction:
      'These 40 UK edtech companies have attracted the most investment, from online learning platforms to tools for schools.',
    stats: {
      highlights: [
        { label: 'Total raised', value: 186200000, format: 'money' },
        { label: 'Median raised', value: 3100000, format: 'money' },
        { label: 'Companies', value: 40, format: 'number' },
      ],
      breakdowns: [
        {
          label: 'Companies by region',
          total: 40,
          items: [
            { label: 'London', count: 24 },
            { label: 'North West', count: 6 },
            { label: 'Scotland', count: 4 },
            { label: 'Other', count: 6 },
          ],
        },
      ],
    },
    sections: [
      {
        heading: 'What kinds of edtech companies attract investment?',
        paragraphs: ['Workplace learning platforms raise more on average than school-focused tools.'],
      },
    ],
  },
]
