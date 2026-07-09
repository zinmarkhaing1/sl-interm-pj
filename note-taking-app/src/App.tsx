// import { ThemeProvider } from '@mui/material';
// import { Router } from './routes/Router';
// import { theme } from './theme/theme';
// import './App.css';

// export default function App() {
//   return (
//     <ThemeProvider theme={theme}>
//       <Router />
//     </ThemeProvider>
//   )
// }

import "./App.css";
import { Router } from "./routes/Router";
import { AppThemeProvider } from "./Context/ThemeContext";
// import 'handsontable/dist/handsontable.full.css';
// import '@syncfusion/ej2-base/styles/material.css';
// import '@syncfusion/ej2-inputs/styles/material.css';
// import '@syncfusion/ej2-buttons/styles/material.css';
// import '@syncfusion/ej2-splitbuttons/styles/material.css';
// import '@syncfusion/ej2-lists/styles/material.css';
// import '@syncfusion/ej2-navigations/styles/material.css';
// import '@syncfusion/ej2-popups/styles/material.css';
// import '@syncfusion/ej2-dropdowns/styles/material.css';
// import '@syncfusion/ej2-grids/styles/material.css';
// import '@syncfusion/ej2-react-spreadsheet/styles/material.css';

export default function App() {
  return (
    <AppThemeProvider>
      <Router />
    </AppThemeProvider>
  );
}