import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import HospitalTransfers from './HospitalTransfers';
import BloodBankTransfers from './BloodBankTransfers';

export default function Transfers() {
  const { user } = useAuth();

  if (user?.role === 'BLOOD_BANK') {
    return <BloodBankTransfers />;
  }
  return <HospitalTransfers />;
}
