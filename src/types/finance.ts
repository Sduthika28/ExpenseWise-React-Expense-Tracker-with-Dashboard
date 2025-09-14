export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  month: string; // Format: YYYY-MM
}

export interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
  savings: number;
}

export interface CategoryData {
  category: string;
  amount: number;
  color: string;
}

export const EXPENSE_CATEGORIES = [
  'Housing',
  'Transportation', 
  'Food & Dining',
  'Entertainment',
  'Shopping',
  'Healthcare',
  'Utilities',
  'Education',
  'Travel',
  'Other'
];

export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Investment',
  'Business',
  'Gift',
  'Other'
];

export const CATEGORY_COLORS = {
  'Housing': '#3B82F6',
  'Transportation': '#10B981', 
  'Food & Dining': '#F59E0B',
  'Entertainment': '#8B5CF6',
  'Shopping': '#EF4444',
  'Healthcare': '#06B6D4',
  'Utilities': '#84CC16',
  'Education': '#F97316',
  'Travel': '#EC4899',
  'Other': '#6B7280',
  'Salary': '#059669',
  'Freelance': '#0891B2',
  'Investment': '#7C3AED',
  'Business': '#DC2626',
  'Gift': '#DB2777',
};