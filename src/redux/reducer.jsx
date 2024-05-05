import {
    FETCH_JOB_LISTINGS_REQUEST,
    FETCH_JOB_LISTINGS_SUCCESS,
    FETCH_JOB_LISTINGS_FAILURE,
    APPLY_FILTERS
  } from './actions';
  
  const initialState = {
    loading: false,
    listings: [],
    error: null,
    filters: {}
  };
  
  const reducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_JOB_LISTINGS_REQUEST:
        return { ...state, loading: true };
      case FETCH_JOB_LISTINGS_SUCCESS:
        return { ...state, loading: false, listings: action.payload, error: null };
      case FETCH_JOB_LISTINGS_FAILURE:
        return { ...state, loading: false, error: action.payload };
      case APPLY_FILTERS:
        return { ...state, filters: action.payload };
      default:
        return state;
    }
  };
  
  export default reducer;
  