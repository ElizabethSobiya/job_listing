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

const filterListings = (listings, filters) => {
  return listings.filter(job => {
    return (
      (!filters.minExperience || job.minExp === parseInt(filters.minExperience)) &&
      (!filters.companyName || job.companyName === filters.companyName) &&
      // (!filters.location || job.location.includes(filters.location.toLowerCase())) && // Allowing partial matches for location
      (!filters.remote || filters.remote === 'Remote' || job.location === 'Remote') && // Handling remote filter separately
      (!filters.role || job.jobRole === filters.role) &&
      (!filters.minimumBasePay || job.minJdSalary >= parseInt(filters.minimumBasePay)) 
    );
  });
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
      // Apply filters to the listings
      const filteredListings = filterListings(state.listings, action.payload);
      return { ...state, filters: action.payload, listings: filteredListings };
    default:
      return state;
  }
};

export default reducer;
