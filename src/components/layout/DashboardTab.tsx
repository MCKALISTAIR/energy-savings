
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutDashboard } from 'lucide-react';
import { getTabIconClassName } from '@/utils/tabIconClasses';

interface DashboardTabProps {
  animatingIcons: Set<string>;
  onTabClick: (tabValue: string) => void;
  isMobile?: boolean;
}

const DashboardTab: React.FC<DashboardTabProps> = ({
  animatingIcons,
  onTabClick,
  isMobile = false
}) => {
  return (
    <TabsList className="grid grid-cols-1">
      <TabsTrigger 
        value="dashboard" 
        className={`flex items-center gap-2 dashboard-tab relative overflow-hidden hover:scale-105 transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/90 data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:font-semibold hover:shadow-md ${
          isMobile 
            ? 'px-4 py-3 min-w-[120px] text-sm' 
            : 'px-8 min-w-[160px]'
        }`}
        onClick={() => onTabClick('dashboard')}
      >
        <LayoutDashboard className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} ${getTabIconClassName('dashboard', animatingIcons)}`} />
        <span className="font-medium">Dashboard</span>
      </TabsTrigger>
    </TabsList>
  );
};

export default DashboardTab;
