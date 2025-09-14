import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  variant?: 'income' | 'expense' | 'savings' | 'default';
  className?: string;
}

export const DashboardCard = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  variant = 'default',
  className
}: DashboardCardProps) => {
  const getCardStyles = () => {
    switch (variant) {
      case 'income':
        return 'bg-gradient-to-br from-success-bg to-success-bg/80 border-success/20';
      case 'expense':
        return 'bg-gradient-to-br from-warning-bg to-warning-bg/80 border-warning/20';
      case 'savings':
        return 'bg-gradient-to-br from-primary to-primary-light shadow-lg';
      default:
        return 'bg-gradient-to-br from-card to-muted/50';
    }
  };

  const getIconStyles = () => {
    switch (variant) {
      case 'income':
        return 'text-success bg-success/10';
      case 'expense':
        return 'text-warning bg-warning/10';
      case 'savings':
        return 'text-primary-foreground bg-white/20';
      default:
        return 'text-primary bg-primary/10';
    }
  };

  const getTextStyles = () => {
    switch (variant) {
      case 'savings':
        return 'text-primary-foreground';
      default:
        return 'text-foreground';
    }
  };

  const getChangeStyles = () => {
    if (changeType === 'positive') return 'text-success';
    if (changeType === 'negative') return 'text-warning';
    return 'text-muted-foreground';
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border p-6 transition-all duration-300 hover:shadow-md hover:scale-[1.02]',
        getCardStyles(),
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className={cn(
            'text-sm font-medium',
            getTextStyles(),
            variant === 'savings' ? 'text-primary-foreground/80' : 'text-muted-foreground'
          )}>
            {title}
          </p>
          <p className={cn(
            'text-2xl font-bold tracking-tight',
            getTextStyles()
          )}>
            {value}
          </p>
          {change && (
            <p className={cn(
              'text-xs font-medium',
              variant === 'savings' ? 'text-primary-foreground/70' : getChangeStyles()
            )}>
              {change}
            </p>
          )}
        </div>
        <div className={cn(
          'flex h-12 w-12 items-center justify-center rounded-lg',
          getIconStyles()
        )}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/5 pointer-events-none" />
    </div>
  );
};