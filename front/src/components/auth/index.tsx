import { useAuth } from "../../data/use-auth";

export function RestrictAuthenticated({ children }) {
    return useAuth().connected && children
}

export function RestrictAnonymous({ children }) {
    return !useAuth().connected && children
}
