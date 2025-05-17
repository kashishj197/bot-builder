import React from "react";
import { Provider } from "react-redux";
import { store } from "./app/store";
import AppRouter from "./routes/AppRouter";
import { BrowserRouter } from "react-router-dom";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </Provider>
  );
};

export default App;
