import axios from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Column = {
  id: number;
  header: string;
  column: string;
};

type Cell = {
  id: number;
  header: string;
  cell: string;
};

interface InputState {
  columns: Column[];
  cells: Cell[];
  text: string;
  response: string;
  error: string;
  loading: boolean;
  updateColumns: (column: Column, id: number) => void;
  updateCells: (cell: Cell, id: number) => void;
  newColumn: () => void;
  newCell: () => void;
  setText: (newText: string) => void;
  loadingOn: () => void;
  loadingOff: () => void;
  getFormula: () => void;
}

const apiConfig = {
  withCredentials: true,
  timeout: 30000,
};

export const useStore = create<InputState>()(
  persist((set, get) => ({
    // initial states
    columns: [{ id: 0, header: "", column: "" }],
    cells: [{ id: 0, header: "", cell: "" }],
    text: "",
    response: "",
    error: "",
    loading: false,

    updateColumns: (column, id) =>
      set((state) => ({
        columns: state.columns.map((c) => {
          if (c.id === id) return column;
          else return c;
        }),
      })),
    updateCells: (cell, id) =>
      set((state) => ({
        cells: state.cells.map((c) => {
          if (c.id === id) return cell;
          else return c;
        }),
      })),

    newColumn: () => {
      const columns = get().columns;
      if (
        columns[columns.length - 1].header.length < 1 ||
        columns[columns.length - 1].column.length < 1
      ) {
        set({
          error:
            "Please provide column title and column id before adding another column",
        });
      } else
        set((state) => ({
          columns: [
            ...state.columns,
            { id: state.columns.length, header: "", column: "" },
          ],
        }));
    },
    newCell: () => {
      const cells = get().cells;
      if (
        cells[cells.length - 1].header.length < 1 ||
        cells[cells.length - 1].cell.length < 1
      ) {
        set({
          error:
            "Please provide cell title and cell id before adding another cell",
        });
      } else
        set((state) => ({
          cells: [
            ...state.cells,
            { id: state.cells.length, header: "", cell: "" },
          ],
        }));
    },

    // store user input
    setText: (newText) => set({ text: newText }),

    // loading clears states
    loadingOn: () =>
      set((state) => ({ loading: true, response: "", error: "" })),
    loadingOff: () => set((state) => ({ loading: false })),

    // get formula api call
    getFormula: async () => {
      const loadingOn = get().loadingOn;
      const loadingOff = get().loadingOff;
      const text = get().text;
      const columns = get().columns;
      const cells = get().cells;

      if (text.length < 1) {
        set(() => ({
          error: "Please enter a prompt",
          response: "",
        }));
      } else {
        loadingOn();
        try {
          await axios
            .post(
              "http://localhost:8080/excel/get_formula",
              { text: text, columns: columns, cells: cells },
              apiConfig
            )
            .then((res) => {
              if (res.data.data.finish_reason != "stop") {
                set({ error: "Error, please try again" });
              } else {
                set({ response: res.data.data.text });
              }
            });
        } catch (error) {
          set({ error: "Error, please try again" });
        }
        loadingOff();
      }
    }
  }),
  
    {
      name: 'input-storage', // name of the item in the storage (must be unique)
      getStorage: () => localStorage, // (optional) by default, 'localStorage' is used
    }),
);
