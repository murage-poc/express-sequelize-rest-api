interface User {
    id: number,
    name: string,
    role: {
        id: number,
        name: string,
    },
    permissions: { id: number, name: string } []
}
