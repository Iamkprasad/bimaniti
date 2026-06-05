export const CATEGORIES = [
  'Life Insurance',
  'General Insurance',
  'Health',
  'Motor',
  'IRDAI/Regulatory',
  'Personal Lines',
];

export const BLOG_CATEGORIES = [...CATEGORIES];
export const NEWS_CATEGORIES = CATEGORIES.filter(c => c !== 'Motor' && c !== 'Personal Lines');

export const CATEGORY_COLORS = {
  'Life Insurance': { bg: '#EAF0F5', text: '#1A4A6E' },
  'General Insurance': { bg: '#EAF5EA', text: '#1A4A2A' },
  'Health': { bg: '#F5EAF0', text: '#6E1A4A' },
  'Motor': { bg: '#FFF3E0', text: '#7A4000' },
  'IRDAI/Regulatory': { bg: '#F0EDF5', text: '#3A1A6E' },
  'Personal Lines': { bg: '#EAF0F5', text: '#1A4A6E' },
  'Breaking': { bg: '#FDECEA', text: '#b94040' },
};
