import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { net } from '../util/net/Net';
import { RootState } from './store';

interface AgricultureMultipleState {
    knowledge: string[];
}

const initialState: AgricultureMultipleState = {
    knowledge: []
};

interface SearchKnowledgeParams {
    keywords: string[];
}

const searchKnowledge = createAsyncThunk(
  'agricultureMultiple/searchKnowledge',
  async (params: SearchKnowledgeParams) => {
      const result = await net.get<string[]>({
        url: '/knowledge/search/',
        params: {
          knowledge: params.keywords.join(',')
        }
      });
      return result.data;
  }
);

const agricultureMultipleSlice = createSlice({
    name: 'agricultureMultiple',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => builder
      .addCase(searchKnowledge.fulfilled, (state, action) => {
        state.knowledge = action.payload.data;
      })
});

export default agricultureMultipleSlice.reducer;

export const agricultureMultipleActions = {
  ...agricultureMultipleSlice.actions,
  searchKnowledge
};

export const agricultureMultipleSelectors = {
  selectKnowledge: (state: RootState) => state.agricultureMultipleReducer.knowledge,
};