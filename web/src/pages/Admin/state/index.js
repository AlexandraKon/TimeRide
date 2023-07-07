

import { configureStore } from "@reduxjs/toolkit";
import { api } from "./api";

const store = configureStore({
  reducer: {
    adminApi: api.reducer,
  },
});

export default store;
