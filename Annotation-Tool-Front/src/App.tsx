import { useState } from 'react';
import AnnotationTool from './components/AnnotationTool/AnnotationTool'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './App.css';


function App() {
  const [mode, setMode] = useState<'dark' | 'light'>('dark');

  const theme = createTheme({
    palette: {
      mode
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <AnnotationTool/>
      </div>
    </ThemeProvider>
  )
}

export default App
