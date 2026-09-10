import React from 'react';
import { FinancialManagementCore } from './FinancialManagementCore';

export interface AIMarketplaceCoreProps {
  companyBills?: any[];
  onVerifyAllBills?: () => void;
  onApproveAllMentors?: () => void;
  onVerifySingleBill?: (id: string) => void;
  onCreateBill?: (bill: any) => void;
  onRejectBill?: (id: string) => void;
  setCompanyBills?: React.Dispatch<React.SetStateAction<any[]>>;
}

export const AIMarketplaceCore: React.FC<AIMarketplaceCoreProps> = (props) => {
  return <FinancialManagementCore {...props} />;
};

export { FinancialManagementCore };
export default AIMarketplaceCore;
