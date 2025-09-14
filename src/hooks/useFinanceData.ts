import { useState, useEffect } from 'react';
import { Transaction, MonthlyData, CategoryData, CATEGORY_COLORS } from '@/types/finance';

const STORAGE_KEY = 'finance-dashboard-data';

export const useFinanceData = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      setTransactions(JSON.parse(savedData));
    }
  }, []);

  // Save to localStorage whenever transactions change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions(prev => [...prev, newTransaction]);
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions(prev => 
      prev.map(t => t.id === id ? { ...t, ...updates } : t)
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  // Calculate current month totals
  const getCurrentMonthData = () => {
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const currentTransactions = transactions.filter(t => t.month === currentMonth);
    
    const income = currentTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = currentTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return { income, expenses, savings: income - expenses };
  };

  // Get monthly trends (Jan–Dec of current year)
  const getMonthlyTrends = (): MonthlyData[] => {
    const now = new Date();
    const year = now.getFullYear();

    // Generate months in order: Jan (0) to Dec (11)
    const monthsData = [];
    for (let m = 0; m < 12; m++) {
      const date = new Date(year, m, 1);
      const monthStr = date.toISOString().slice(0, 7);
      
      const monthTransactions = transactions.filter(t => t.month === monthStr);
      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      const expenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      monthsData.push({
        month: monthStr,
        income,
        expenses,
        savings: income - expenses
      });
    }

    return monthsData;
  };

  // Get expense categories data for pie chart
  const getExpenseCategories = (): CategoryData[] => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const currentExpenses = transactions.filter(
      t => t.type === 'expense' && t.month === currentMonth
    );

    const categoryTotals = currentExpenses.reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category,
        amount,
        color: CATEGORY_COLORS[category] || '#6B7280'
      }))
      .sort((a, b) => b.amount - a.amount);
  };

  // Get recent transactions
  const getRecentTransactions = (limit = 5) => {
    return [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  };

  return {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getCurrentMonthData,
    getMonthlyTrends,
    getExpenseCategories,
    getRecentTransactions,
  };
};