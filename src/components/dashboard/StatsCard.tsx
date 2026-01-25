import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  iconColor?: string;
  description?: string;
  trend?: { value: number; label: string };
}

export const StatsCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral',
  icon: Icon,
  iconColor = 'text-primary',
  description,
  trend
}: StatsCardProps) => {
  return (
    <div className="bg-card rounded-xl border border-border p-6 card-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {change && (
            <p className={cn(
              "text-sm mt-2",
              changeType === 'positive' && "text-green-600",
              changeType === 'negative' && "text-destructive",
              changeType === 'neutral' && "text-muted-foreground"
            )}>
              {change}
            </p>
          )}
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
          {trend && (
            <p className="text-sm text-muted-foreground mt-1">
              {trend.value} {trend.label}
            </p>
          )}
        </div>
        <div className={cn("p-3 rounded-xl bg-muted", iconColor)}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};
