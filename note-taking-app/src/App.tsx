import { ThemeProvider } from '@mui/material';
import { Router } from './routes/Router';
import { theme } from './theme/theme';
import './App.css';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router />
    </ThemeProvider>
  )
}