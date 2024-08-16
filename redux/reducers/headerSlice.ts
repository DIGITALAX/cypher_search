import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface HeaderState {
  value: boolean;
}

const initialHeaderState: HeaderState = {
  value: false,
};

export const headerSlice = createSlice({
  name: "header",
  initialState: initialHeaderState,
  reducers: {
    setHeader: (
      state: HeaderState,
      action: PayloadAction<boolean>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setHeader } = headerSlice.actions;

export default headerSlice.reducer;
