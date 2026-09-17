import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/state/auth.slice";

const AppStore = configureStore({
    reducer: {
        auth: authReducer,
    },
});

export default AppStore;