export const initialTagState = {
    tags: {},
    editTagId: ''
}

export let tagsReducer = {
    updateTag: (state, action) => {
        state.tags[action.payload.fid] = action.payload;
    },
    deleteTag: (state, action) => {
        delete state.tags[action.payload.fid]
    },
    setTags: (state, action) => {
        state.tags = action.payload;
    },
    setEditTagId: (state, action) => {
        state.editTagId = action.payload;
    }
}