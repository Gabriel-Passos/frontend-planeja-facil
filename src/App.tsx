import { Toaster } from "./components/ui/toast";
import { GlobalContextProvider } from "./contexts/GlobalContext";
import { CustomRoutes } from "./routes";
import "./styles/global.css";

function App() {
  return (
    <GlobalContextProvider>
      <CustomRoutes />
      <Toaster />
    </GlobalContextProvider>
  );
}

export default App;
