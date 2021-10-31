export const initialTagState = {
    tags: {}
}

export let tagsReducer = {
    addTag: (state, action) => {
        state.tags[action.payload.fid] = action.payload;
    },
    deleteTag: (state, action) => {
        delete state.tags[action.payload.fid]
    },
    setTags: (state, action) => {
        state.tags = action.payload;
    }
}