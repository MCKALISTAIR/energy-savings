
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { List, Calendar } from 'lucide-react';

const SystemManagerTabs: React.FC = () => {
  return (
    <TabsList className="grid w-full grid-cols-2">
      <TabsTrigger value="list" className="flex items-center gap-2">
        <List className="w-4 h-4" />
        Current House
      </TabsTrigger>
      <TabsTrigger value="timeline" className="flex items-center gap-2">
        <Calendar className="w-4 h-4" />
        Timeline View
      </TabsTrigger>
    </TabsList>
  );
};

export default SystemManagerTabs;
