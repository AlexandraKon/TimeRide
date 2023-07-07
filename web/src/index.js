import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from 'react-redux';
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

import "./index.css";
import App from "./App";
import store from "./redux/store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistStore(store)}>
          <App />
        </PersistGate>
      </Provider>
    </React.StrictMode>
);