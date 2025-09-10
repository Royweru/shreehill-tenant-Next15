// Create this hook file: /modalHooks/usePaymentHistoryModal.ts

import { create } from 'zustand';

interface PaymentHistoryModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const usePaymentHistoryModal = create<PaymentHistoryModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));