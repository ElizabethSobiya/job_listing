import React, { Suspense, lazy } from "react";
import { connect } from "react-redux";
import { applyFilters } from "./redux/actions";
import Searchbar from "./components/Searchbar";

// Lazy load the JobCard component
const LazyJobCard = lazy(() => import("./components/Jobs"));

function App({ applyFilters }) {
  return (
    <>
      <Searchbar applyFilters={applyFilters} />
      <Suspense fallback={<div>Loading...</div>}>
        <LazyJobCard />
      </Suspense>
    </>
  );
}

const mapDispatchToProps = (dispatch) => ({
  applyFilters: (filters) => dispatch(applyFilters(filters)),
});

export default connect(null, mapDispatchToProps)(App);
