
import React from 'react';
import SolarSpecifications from './specifications/SolarSpecifications';
import BatterySpecifications from './specifications/BatterySpecifications';
import EVSpecifications from './specifications/EVSpecifications';

interface SystemSpecificationsProps {
  systemType: 'solar' | 'battery' | 'ev';
  getSpecValue: (key: string, defaultValue?: any) => any;
  updateSpecification: (key: string, value: any) => void;
  errors: any;
  showErrors: boolean;
  isMobile: boolean;
}

const SystemSpecifications: React.FC<SystemSpecificationsProps> = ({
  systemType,
  getSpecValue,
  updateSpecification,
  errors,
  showErrors,
  isMobile
}) => {
  switch (systemType) {
    case 'solar':
      return (
        <SolarSpecifications
          getSpecValue={getSpecValue}
          updateSpecification={updateSpecification}
          errors={errors}
          showErrors={showErrors}
          isMobile={isMobile}
        />
      );

    case 'battery':
      return (
        <BatterySpecifications
          getSpecValue={getSpecValue}
          updateSpecification={updateSpecification}
          errors={errors}
          showErrors={showErrors}
          isMobile={isMobile}
        />
      );

    case 'ev':
      return (
        <EVSpecifications
          getSpecValue={getSpecValue}
          updateSpecification={updateSpecification}
          errors={errors}
          showErrors={showErrors}
          isMobile={isMobile}
        />
      );

    default:
      return null;
  }
};

export default SystemSpecifications;
