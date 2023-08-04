import { Timestamp } from "@firebase/firestore";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Entry {
  // Define the properties of a diary entry
  id: string;
  userId: string | null;
  description: string;
  category: string;
  image: string;
  // image: File | null;
  isPublic: boolean;
  createdAt: Timestamp;
  startDate: string;
  endDate: string;
}
interface EntriesState {
  entries: Entry[];
}

const initialState: EntriesState = {
  entries: [],
};

export const entriesSlice = createSlice({
  name: "entries",
  initialState,
  reducers: {
    createEntry: (state, action: PayloadAction<Entry>) => {
      state.entries.push(action.payload);
    },
    setEntries: (state, action: PayloadAction<Entry[]>) => {
      state.entries = action.payload;
    },
    deleteDiaryEntry: (state, action: PayloadAction<string>) => {
      state.entries = state.entries.filter((entry) => entry.id !== action.payload);
    },
    toggleEntryStatus: (state, action: PayloadAction<string>) => {
      const entry = state.entries.find((entry) => entry.id === action.payload);
      if (entry) {
        entry.isPublic = !entry.isPublic;
      }
    },
  },
});

export const { createEntry, deleteDiaryEntry, setEntries, toggleEntryStatus } = entriesSlice.actions;

export default entriesSlice.reducer;
