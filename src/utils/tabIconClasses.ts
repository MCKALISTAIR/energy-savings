
export const getTabIconClassName = (tabValue: string, animatingIcons: Set<string>): string => {
  if (!animatingIcons.has(tabValue)) return "w-5 h-5";
  
  const baseClass = "w-5 h-5";
  switch (tabValue) {
    case 'battery': return `${baseClass} icon-battery-charging`;
    case 'ev': return `${baseClass} icon-car-moving`;
    case 'solar': return `${baseClass} icon-solar-pulse`;
    case 'systems': return `${baseClass} icon-settings-spin`;
    case 'heatpump': return `${baseClass} icon-heatpump-wave`;
    case 'dashboard': return `${baseClass} icon-dashboard-bounce`;
    case 'smartmeter': return `${baseClass} icon-smart-meter-pulse`;
    default: return baseClass;
  }
};
