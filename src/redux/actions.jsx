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

export const fetchJobListings = (limit, offset) => async (dispatch) => {
  dispatch(fetchJobListingsRequest());
  try {
    const body = JSON.stringify({ limit, offset });
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body,
    };

    const response = await fetch(
      `https://api.weekday.technology/adhoc/getSampleJdJSON`,
      requestOptions
    );

    if (!response.ok) {
      throw new Error("Failed to fetch job listings");
    }

    const data = await response.json();
    console.log(data.jdList, 'data')
    dispatch(fetchJobListingsSuccess(data.jdList));
  } catch (error) {
    dispatch(fetchJobListingsFailure(error.message));
  }
};
