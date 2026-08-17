import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import DonorDonations from './DonorDonations';
import BloodBankDonations from './BloodBankDonations';

export default function Donations() {
  const { user } = useAuth();

  if (user?.role === 'BLOOD_BANK') {
    return <BloodBankDonations />;
  }
  return <DonorDonations />;
}
