import { useState } from 'react';
import { DollarSign, TrendingUp, Wallet, PiggyBank, Calculator, Target } from 'lucide-react';
import { useFinanceData } from '@/hooks/useFinanceData';
import { DashboardCard } from '@/components/finance/DashboardCard';
import { TransactionForm } from '@/components/finance/TransactionForm';
import { ExpensePieChart, SavingsTrendChart, MonthlyExpensesChart } from '@/components/finance/Charts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  const {
    addTransaction,
    getCurrentMonthData,
    getMonthlyTrends,
    getExpenseCategories,
    getRecentTransactions,
  } = useFinanceData();

  const currentData = getCurrentMonthData();
  const monthlyTrends = getMonthlyTrends();
  const expenseCategories = getExpenseCategories();
  const recentTransactions = getRecentTransactions();

  const formatCurrency = (amount: number) => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(amount));
    return amount < 0 ? `-${formatted}` : formatted;
  };

  const handleAddTransaction = (transaction: any) => {
    addTransaction(transaction);
    toast({
      title: "Transaction Added",
      description: `${transaction.type === 'income' ? 'Income' : 'Expense'} of ${formatCurrency(transaction.amount)} has been recorded.`,
    });
  };

  const getSavingsPercentage = () => {
    if (currentData.income === 0) return 0;
    return ((currentData.savings / currentData.income) * 100).toFixed(0);
  };

  const getSavingsAdvice = () => {
    const savingsRate = Number(getSavingsPercentage());
    if (savingsRate >= 20) {
      return { message: "Excellent! You're saving more than 20% of your income.", type: "success" };
    } else if (savingsRate >= 10) {
      return { message: "Good job! Try to increase your savings rate to 20%.", type: "warning" };
    } else if (savingsRate > 0) {
      return { message: "You're saving some money, but try to aim for at least 10%.", type: "warning" };
    } else {
      return { message: "Consider reducing expenses to start building savings.", type: "destructive" };
    }
  };

  const advice = getSavingsAdvice();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-primary to-primary-light rounded-lg shadow-lg">
                <PiggyBank className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                  Personal Finance Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">
                  Track your income, expenses, and build better financial habits
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardCard
            title="Total Income"
            value={formatCurrency(currentData.income)}
            icon={DollarSign}
            variant="income"
            change="This month"
          />
          <DashboardCard
            title="Total Expenses"
            value={formatCurrency(currentData.expenses)}
            icon={Wallet}
            variant="expense"
            change="This month"
          />
          <DashboardCard
            title="Savings"
            value={formatCurrency(currentData.savings)}
            icon={TrendingUp}
            variant="savings"
            change={`${getSavingsPercentage()}% of income`}
          />
        </div>

        {/* Summary Insights */}
        {(currentData.income > 0 || currentData.expenses > 0) && (
          <Card className="bg-gradient-to-r from-accent/50 to-accent/30 border-accent/20">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <Calculator className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Monthly Summary</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                <p className="text-sm text-muted-foreground">
                  {advice.message}
                </p>
                <Badge 
                  variant={advice.type === 'success' ? 'default' : advice.type === 'warning' ? 'secondary' : 'destructive'}
                  className="ml-auto"
                >
                  Savings Rate: {getSavingsPercentage()}%
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted/50">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="add-transaction">Add Transaction</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8 mt-6">
            {/* Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <ExpensePieChart data={expenseCategories} />
              <SavingsTrendChart data={monthlyTrends} />
            </div>
            
            <MonthlyExpensesChart data={monthlyTrends} />

            {/* Recent Transactions */}
            {recentTransactions.length > 0 && (
              <Card className="bg-gradient-to-br from-card to-muted/30 border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Recent Transactions</CardTitle>
                  <CardDescription>Your latest financial activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentTransactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <Badge 
                              variant={transaction.type === 'income' ? 'default' : 'secondary'}
                              className={transaction.type === 'income' ? 'bg-success text-white' : 'bg-warning text-white'}
                            >
                              {transaction.category}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {new Date(transaction.date).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="font-medium mt-1">{transaction.description}</p>
                        </div>
                        <div className={`text-lg font-bold ${
                          transaction.type === 'income' ? 'text-success' : 'text-warning'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="add-transaction" className="mt-6">
            <TransactionForm onSubmit={handleAddTransaction} />
          </TabsContent>

          <TabsContent value="insights" className="space-y-6 mt-6">
            <Card className="bg-gradient-to-br from-card to-muted/30 border-border/50">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Financial Health Tips</CardTitle>
                </div>
                <CardDescription>Recommendations based on your spending patterns</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-success-bg rounded-lg border border-success/20">
                    <h4 className="font-semibold text-success mb-2">Build an Emergency Fund</h4>
                    <p className="text-sm text-muted-foreground">
                      Aim to save 3-6 months of expenses for unexpected situations.
                    </p>
                  </div>
                  <div className="p-4 bg-warning-bg rounded-lg border border-warning/20">
                    <h4 className="font-semibold text-warning mb-2">Track Your Spending</h4>
                    <p className="text-sm text-muted-foreground">
                      Review your largest expense categories and look for areas to optimize.
                    </p>
                  </div>
                  <div className="p-4 bg-accent rounded-lg border border-accent-foreground/20">
                    <h4 className="font-semibold text-accent-foreground mb-2">Set Savings Goals</h4>
                    <p className="text-sm text-muted-foreground">
                      Create specific, measurable goals to stay motivated with your savings.
                    </p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg border border-border">
                    <h4 className="font-semibold text-foreground mb-2">Automate Your Finances</h4>
                    <p className="text-sm text-muted-foreground">
                      Set up automatic transfers to make saving effortless and consistent.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;