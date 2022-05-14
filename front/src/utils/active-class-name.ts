export const activeClassName = (className: string) => {
    return ({ isActive }) => (isActive ? `${className} active` : className)
}
