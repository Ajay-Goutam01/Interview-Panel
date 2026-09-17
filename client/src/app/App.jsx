import AppProvider from "./AppProvider";
import AppRoutes from "./AppRoutes";

const App = () => {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
};

export default App;
