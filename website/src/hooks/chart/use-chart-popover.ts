import { useState } from 'react';

interface UseChartPopoverResult {
  isExpanded: boolean;
  toggleExpanded: () => void;
}

export function useChartPopover(): UseChartPopoverResult {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return {
    isExpanded,
    toggleExpanded,
  };
}
