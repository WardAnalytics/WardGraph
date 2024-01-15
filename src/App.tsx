import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClientProvider } from 'react-query'

import Routes from './Routes';
import useCustomQueryClient from './hooks/useCustomQueryClient';
import './firebase/firebase'

function App() {
  const queryClient = useCustomQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes />
      </Router>
    </QueryClientProvider>
  );
}

export default App
