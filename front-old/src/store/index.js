import { createStore } from "vuex";

import * as auth from "./modules/auth";
import * as api from "./modules/api";

export const store = createStore({
    modules: {
        auth,
        api
    }
})
