import { GlobalContextProvider } from "./contexts/GlobalContext";
import { CustomRoutes } from "./routes";
import "./styles/global.css";

function App() {
  return (
    <GlobalContextProvider>
      <CustomRoutes />
    </GlobalContextProvider>
  );
}

export default App;
