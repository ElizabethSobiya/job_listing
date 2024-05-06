import React from "react";
import { connect } from "react-redux";
import { applyFilters } from "./redux/actions";
import Navbar from "./components/Navbar";
import Searchbar from "./components/Searchbar";
import JobCard from "./components/Jobs";

function App({ applyFilters }) {
  return (
    <>
      {/* <Navbar/> */}
      <Searchbar applyFilters={applyFilters} />
      <JobCard />
    </>
  );
}

const mapDispatchToProps = (dispatch) => ({
  applyFilters: (filters) => dispatch(applyFilters(filters)),
});

export default connect(null, mapDispatchToProps)(App);
