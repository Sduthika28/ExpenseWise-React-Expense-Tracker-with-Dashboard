import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CategoryData, MonthlyData } from '@/types/finance';
import { TrendingUp, PieChart as PieChartIcon, BarChart3 } from 'lucide-react';

interface ExpensePieChartProps {
  data: CategoryData[];
}

export const ExpensePieChart = ({ data }: ExpensePieChartProps) => {
  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg shadow-lg p-3">
          <p className="font-medium">{data.category}</p>
          <p className="text-sm text-muted-foreground">
            {formatCurrency(data.amount)} ({((data.amount / data.total) * 100).toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  // Calculate total for percentage
  const total = data.reduce((sum, item) => sum + item.amount, 0);
  const dataWithTotal = data.map(item => ({ ...item, total }));

  return (
    <Card className="bg-gradient-to-br from-card to-muted/30 border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2">
          <PieChartIcon className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Expenses by Category</CardTitle>
        </div>
        <CardDescription>Current month spending breakdown</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <div className="space-y-4">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dataWithTotal}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="amount"
                >
                  {dataWithTotal.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="grid grid-cols-2 gap-2">
              {data.slice(0, 6).map((item, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <div 
                    className="w-3 h-3 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="truncate text-muted-foreground">{item.category}</span>
                  <span className="font-medium ml-auto">{formatCurrency(item.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            <div className="text-center">
              <PieChartIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No expense data for this month</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface SavingsTrendChartProps {
  data: MonthlyData[];
}

export const SavingsTrendChart = ({ data }: SavingsTrendChartProps) => {
  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;
  const formatMonth = (month: string) => {
    const date = new Date(month + '-01');
    return date.toLocaleDateString('en-US', { month: 'short' });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg shadow-lg p-3">
          <p className="font-medium">{formatMonth(label)}</p>
          <p className="text-sm text-success">
            Savings: {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-gradient-to-br from-card to-muted/30 border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Savings Trend</CardTitle>
        </div>
        <CardDescription>12-month savings performance</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="month" 
              tickFormatter={formatMonth}
              stroke="hsl(var(--muted-foreground))"
              interval={0}
            />
            <YAxis 
              tickFormatter={formatCurrency}
              stroke="hsl(var(--muted-foreground))"
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="savings" 
              stroke="hsl(var(--success))" 
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--success))', strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, stroke: 'hsl(var(--success))', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

interface MonthlyExpensesChartProps {
  data: MonthlyData[];
}

export const MonthlyExpensesChart = ({ data }: MonthlyExpensesChartProps) => {
  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;
  const formatMonth = (month: string) => {
    const date = new Date(month + '-01');
    return date.toLocaleDateString('en-US', { month: 'short' });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg shadow-lg p-3">
          <p className="font-medium">{formatMonth(label)}</p>
          <p className="text-sm text-success">
            Income: {formatCurrency(payload.find((p: any) => p.dataKey === 'income')?.value || 0)}
          </p>
          <p className="text-sm text-warning">
            Expenses: {formatCurrency(payload.find((p: any) => p.dataKey === 'expenses')?.value || 0)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-gradient-to-br from-card to-muted/30 border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Monthly Overview</CardTitle>
        </div>
        <CardDescription>12-month income vs expenses comparison</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="month" 
              tickFormatter={formatMonth}
              stroke="hsl(var(--muted-foreground))"
              interval={0}
            />
            <YAxis 
              tickFormatter={formatCurrency}
              stroke="hsl(var(--muted-foreground))"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey="income" 
              fill="hsl(var(--success))" 
              name="Income"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="expenses" 
              fill="hsl(var(--warning))" 
              name="Expenses"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};