export const FETCH_JOB_LISTINGS_REQUEST = "FETCH_JOB_LISTINGS_REQUEST";
export const FETCH_JOB_LISTINGS_SUCCESS = "FETCH_JOB_LISTINGS_SUCCESS";
export const FETCH_JOB_LISTINGS_FAILURE = "FETCH_JOB_LISTINGS_FAILURE";
export const APPLY_FILTERS = "APPLY_FILTERS";

export const fetchJobListingsRequest = () => ({
  type: FETCH_JOB_LISTINGS_REQUEST,
});

export const fetchJobListingsSuccess = (listings) => ({
  type: FETCH_JOB_LISTINGS_SUCCESS,
  payload: listings,
});

export const fetchJobListingsFailure = (error) => ({
  type: FETCH_JOB_LISTINGS_FAILURE,
  payload: error,
});

export const applyFilters = (filters) => ({
  type: APPLY_FILTERS,
  payload: filters,
});

export const fetchJobListings = () => async (dispatch) => {
  dispatch(fetchJobListingsRequest());
  try {
    const response = await fetch(
      "https://api.weekday.technology/adhoc/getSampleJdJSON"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch job listings");
    }
    const data = await response.json();
    dispatch(fetchJobListingsSuccess(data.jdList));
  } catch (error) {
    dispatch(fetchJobListingsFailure(error.message));
  }
};
