
import { RootState } from "@/redux/store";

export function isUserAuthenticated(state: RootState) {
  return state.auth.isLoggedIn; // Adjust this according to your Redux state structure
}
