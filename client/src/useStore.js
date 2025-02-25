import { create } from "zustand";

export const useStore = create((set) => ({
  loading: false,
  setLoading: (loading) => set({ loading }),
  setMedicalCondition: (data) => set({ medicalCondition: data }),
  medicalCondition: null,
}));
