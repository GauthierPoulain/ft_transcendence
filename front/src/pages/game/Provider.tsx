import { createContext } from "react"

const Context = createContext(null)

export default function PongProvider({ children }) {
    return <Context.Provider value={null}>{children}</Context.Provider>
}
