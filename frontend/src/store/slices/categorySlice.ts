import { createSlice } from '@reduxjs/toolkit';

interface CategoryState {
  selectedCategoryId: string | null;
}

const initialState: CategoryState = {
  selectedCategoryId: null,
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setCategory(state, action) {
      state.selectedCategoryId = action.payload;
    },
    clearCategory(state) {
      state.selectedCategoryId = null;
    },
  },
});

export const { setCategory, clearCategory } = categorySlice.actions;
export default categorySlice.reducer;
