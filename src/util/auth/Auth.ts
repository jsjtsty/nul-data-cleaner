import { authActions } from "../../action/Auth";
import { store } from "../../action/store";

function clearAuth() {
  store.dispatch(authActions.clear());
}

export { clearAuth }; 