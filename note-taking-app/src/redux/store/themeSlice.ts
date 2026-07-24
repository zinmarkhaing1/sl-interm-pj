
import { createSlice, } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface ThemeState {
  darkMode: boolean;
}


const loadInitialState = (): ThemeState => {
  try {
    const stored = localStorage.getItem('theme');
    if (stored) {
      return { darkMode: JSON.parse(stored) };
    }
  } catch (e) {
    // ignore
  }
  return { darkMode: false }; // default light mode
};

const initialState: ThemeState = loadInitialState();

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
   //to store in localstorage
      localStorage.setItem('theme', JSON.stringify(state.darkMode));
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload;
      localStorage.setItem('theme', JSON.stringify(action.payload));
    },
  },
});


export const { toggleDarkMode, setDarkMode } = themeSlice.actions;

// export reducer
export default themeSlice.reducer;