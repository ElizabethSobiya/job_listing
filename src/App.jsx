import React from "react";
import Navbar from "./components/Navbar";
import Searchbar from "./components/Searchbar";
import JobCard from "./components/Jobs";

function App() {
  return (
    <>
      {/* <Navbar/> */}
      <Searchbar/>
      <JobCard />
    </>
  );
}

export default App;
