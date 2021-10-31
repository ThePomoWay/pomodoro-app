import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createIDBTag, getAllTagsFromIDB } from "../../API/indexed-db-ops/tagsCrud";
import { initialTagState, tagsReducer } from "../reducers/TagsReducer";

export const createTagThunk = createAsyncThunk(
    'create/tags',
    async (tag, {dispatch}) => {
        dispatch(addTag(tag));
        let response = createIDBTag(tag);
        return response;
    }
)

export const getAllTags = createAsyncThunk(
    'get/tags',
    async (tag, {dispatch}) => {
        let response = await getAllTagsFromIDB();
        return response;

    }
)

export const tagsSlice = createSlice({
    name: 'tagsSlice',
    initialState: initialTagState,
    reducers: tagsReducer,
    extraReducers: (builder) => {
        builder.addCase(getAllTags.fulfilled, (state, action) => {
            let tagObj = {}
            for(let tag of action.payload as Array<any>) {
                tagObj[tag.fid] = tag
            }

            state.tags = tagObj;
        })
    }
}
)



export const {addTag, deleteTag, setTags} = tagsSlice.actions