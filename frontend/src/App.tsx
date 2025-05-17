import React from "react";
import { Provider } from "react-redux";
import { store } from "./app/store";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div>
        <h1>Welcome to the App</h1>
      </div>
    </Provider>
  );
};

export default App;
