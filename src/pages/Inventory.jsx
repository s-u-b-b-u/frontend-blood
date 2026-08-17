import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import HospitalInventory from './HospitalInventory';
import BloodBankInventory from './BloodBankInventory';

export default function Inventory() {
  const { user } = useAuth();

  if (user?.role === 'BLOOD_BANK') {
    return <BloodBankInventory />;
  }
  return <HospitalInventory />;
}
