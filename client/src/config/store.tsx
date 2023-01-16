import axios from "axios";
import { v4 } from 'uuid';
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Label } from "./types";

const apiConfig = {
  withCredentials: true,
  timeout: 30000,
};

interface InputState {
  product: string
  labels: Label[];
  user_input: string;
  response: string;
  error: string;
  loading: boolean;
  updateProduct: (product: string) => void;
  updateLabels: (label: Label, id: string) => void;
  newLabel: (type: string) => void;
  deleteLabel: (id: string) => void;
  setUserInput: (newInput: string) => void;
  loadingOn: () => void;
  loadingOff: () => void;
  getFormula: () => void;
}

export const useStore = create<InputState>()(
  persist(
    (set, get) => ({
      // initial states
      product: "Excel",
      labels: [],
      user_input: "",
      response: "",
      error: "",
      loading: false,

      updateProduct: (product) => set({product: product}),

      updateLabels: (label, id) =>
        set((state) => ({
          labels: state.labels.map((l) => {
            if (l.id === id) return label;
            else return l;
          }),
        })),

      newLabel: (type: string) =>
        set((state) => ({
          labels: [
            ...state.labels,
            { id: v4(), label: "", name: "", type: type },
          ],
        })),
      
      deleteLabel: (id) => set((state)=>({labels: state.labels.filter(l => l.id !== id)})),

      // store user input
      setUserInput: (newInput) => set({ user_input: newInput }),

      // loading clears states
      loadingOn: () => set(() => ({ loading: true, response: "", error: "" })),
      loadingOff: () => set(() => ({ loading: false })),

      // get formula api call
      getFormula: async () => {
        const loadingOn = get().loadingOn;
        const loadingOff = get().loadingOff;
        const product = get().product
        const user_input = get().user_input;
        const labels = get().labels;

        if (user_input.length < 1) {
          set(() => ({
            error: "Please enter a prompt",
            response: "",
          }));
        } else {
          loadingOn();
          try {
            await axios
              .post(
                "http://localhost:8080/get_formula",
                {product: product, user_input: user_input, labels: labels },
                apiConfig
              )
              .then((res) => {
                if (res.data.data.finish_reason != "stop") {
                  set({ error: "Error, please try again" });
                } else {
                  set({ response: res.data.data.response });
                }
              });
          } catch (error) {
            set({ error: "Error, please try again" });
          }
          loadingOff();
        }
      },
    }),
    {
      name: "input-storage",
      getStorage: () => localStorage,
    }
  )
);
