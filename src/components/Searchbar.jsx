import React, { useState } from "react";
import { useSelector } from "react-redux";
import Select, { components } from "react-select";
import ClearIcon from "@mui/icons-material/Clear";
import "./style.css";

function SearchFilters({ applyFilters }) {
  const jobListings = useSelector((state) => state.listings); // Assuming the Redux store has job listings data

  // Function to generate options for a filter based on property name
  const generateOptions = (property) => {
    const uniqueValues = [...new Set(jobListings.map((job) => job[property]))];
    return uniqueValues.map((value) => ({ value, label: value }));
  };

  const filterOptions = {
    minExp: generateOptions("minExp"),
    companyName: generateOptions("companyName"),
    location: generateOptions("location"),
    jobRole: generateOptions("jobRole"),
    minJdSalary: generateOptions("minJdSalary"),
  };

  const [selectedFilters, setSelectedFilters] = useState({});

  const handleChange = (selectedOptions, filterKey) => {
    // Clear previously selected options for the filter
    const updatedFilters = {
      ...selectedFilters,
      [filterKey]: selectedOptions,
    };
    // Clear previously selected options for the filter
    if (selectedOptions.length === 0) {
      delete updatedFilters[filterKey];
    }
    setSelectedFilters(updatedFilters);
    // Apply filters only if at least one option is selected for any filter
    const anyFilterSelected = Object.values(updatedFilters).some(
      (options) => options.length > 0
    );
    applyFilters(anyFilterSelected ? updatedFilters : {});
    // console.log(updatedFilters, "filters");
  };
  const clearFilter = (filterKey) => {
    setSelectedFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters, [filterKey]: [] };
      applyFilters(updatedFilters);
      return updatedFilters;
    });
  };

  return (
    <div className="search-filters">
      <form className="filter-form">
        {Object.entries(filterOptions).map(([key, options]) => (
          <div
            className="filter"
            key={key}
            style={{
              textTransform: "capitalize",
            }}
          >
            <label
              htmlFor={key}
              className={selectedFilters[key]?.length > 0 ? "label" : "hidden"}
            >
              {key}
            </label>
            <Select
              id={key}
              name={key}
              options={options}
              value={selectedFilters[key]}
              onChange={(selectedOptions) => handleChange(selectedOptions, key)}
              isMulti
              placeholder={`${key}`}
              components={{
                Option: CustomOption,
              }}
            />
          </div>
        ))}
      </form>
    </div>
  );
}

// Custom Option component to include a clear filter button
const CustomOption = ({ children, ...props }) => (
  <components.Option {...props}>
    <div style={{ display: "flex", alignItems: "center" }}>
      <div>{children}</div>
      {props.isSelected && (
        <button
          className="clear-filter-btn"
          onClick={() => props.data.clearFilter(props.data.filterKey)}
        >
          <ClearIcon />
        </button>
      )}
    </div>
  </components.Option>
);

export default SearchFilters;
