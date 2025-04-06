
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Info } from 'lucide-react';

interface CrimeSeverityBadgeProps {
  severity: string;
}

const CrimeSeverityBadge: React.FC<CrimeSeverityBadgeProps> = ({ severity }) => {
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return { color: 'bg-danger hover:bg-danger-hover text-white', icon: <AlertCircle className="h-3 w-3 mr-1" /> };
      case 'medium':
        return { color: 'bg-caution hover:bg-caution-hover text-white', icon: <AlertCircle className="h-3 w-3 mr-1" /> };
      case 'low':
        return { color: 'bg-safe hover:bg-safe-hover text-white', icon: <Info className="h-3 w-3 mr-1" /> };
      default:
        return { color: 'bg-gray-500 text-white', icon: <Info className="h-3 w-3 mr-1" /> };
    }
  };

  const badgeInfo = getSeverityBadge(severity);

  return (
    <Badge className={badgeInfo.color}>
      <span className="flex items-center">
        {badgeInfo.icon}
        {severity.charAt(0).toUpperCase() + severity.slice(1)}
      </span>
    </Badge>
  );
};

export default CrimeSeverityBadge;
