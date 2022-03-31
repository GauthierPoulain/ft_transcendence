export interface Entity {
    id: number
}

export type State<T> = Map<number, T>

export type Repository<T> = {
    addOne(state: State<T>, entity: T): State<T>
    addMany(state: State<T>, entities: T[]): State<T>

    updateOne(state: State<T>, entity: T): State<T>

    setAll(entities: T[]): State<T>

    removeOne(state: State<T>, id: number): State<T>

    initialState(): State<T>

    selectById(state: State<T>, id: number): T | undefined
    selectAll(state: State<T>): T[]
}

const addMany = <T extends Entity>(
    state: State<T>,
    entities: T[]
): State<T> => {
    const new_entities = new Map(state)

    for (const entity of entities) {
        new_entities.set(entity.id, entity)
    }

    return new_entities
}

const updateOne = <T extends Entity>(state: State<T>, entity: T): State<T> => {
    if (state.has(entity.id)) {
        return addMany(state, [entity])
    }

    return state
}

const removeOne = <T extends Entity>(state: State<T>, id: number): State<T> => {
    const entities = new Map(state)
    entities.delete(id)

    return entities
}

const initialState = () => new Map()

export const createRepository = <T extends Entity>(): Repository<T> => ({
    addMany,
    addOne: (state, entity) => addMany(state, [entity]),
    setAll: (entities) => addMany(initialState(), entities),
    updateOne,
    removeOne,
    initialState,
    selectById: (state, id) => state.get(id),
    selectAll: (state) => Array.from(state.values()),
})
