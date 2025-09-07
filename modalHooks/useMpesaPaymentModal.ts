
import { create } from 'zustand'

interface MpesaPaymentModalStore {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

export const useMpesaPaymentModal = create<MpesaPaymentModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}))
