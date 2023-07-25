import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Entry {
  // Define the properties of a diary entry
  description: string;
  category: string;
  image: File | null;
  isPublic: boolean;
  createdAt: Date;
  startDate: Date;
  endDate: Date;
}
interface EntriesState {
  entries: Entry[];
}

const initialState: EntriesState = {
  entries: [],
};

const entriesSlice = createSlice({
  name: "entries",
  initialState,
  reducers: {
    createEntry: (state, action: PayloadAction<Entry>) => {
      state.entries.push(action.payload);
    },
  },
});

export const { createEntry } = entriesSlice.actions;

export default entriesSlice.reducer;
