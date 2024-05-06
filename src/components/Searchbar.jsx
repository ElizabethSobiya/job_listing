import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Select, { components } from 'react-select';
import ClearIcon from '@mui/icons-material/Clear';
import './style.css';

function SearchFilters({ applyFilters }) {
  const jobListings = useSelector(state => state.listings); // Assuming the Redux store has job listings data

  // Function to generate options for a filter based on property name
  const generateOptions = (property) => {
    const uniqueValues = [...new Set(jobListings.map(job => job[property]))];
    return uniqueValues.map(value => ({ value, label: value }));
  };

  const filterOptions = {
    minExp: generateOptions('minExp'),
    companyName: generateOptions('companyName'),
    location: generateOptions('location'),
    jobRole: generateOptions('jobRole'),
    minJdSalary: generateOptions('minJdSalary')
  };

  const [selectedFilters, setSelectedFilters] = useState({});

  const handleChange = (selectedOptions, filterKey) => {
    const updatedFilters = { ...selectedFilters, [filterKey]: selectedOptions };
    setSelectedFilters(updatedFilters);
    
    // Check if selected options are empty, if so, reset filters to empty object
    if (Object.values(updatedFilters).every(options => options.length === 0)) {
      applyFilters({});
    } else {
      applyFilters(updatedFilters);
    }
    
    console.log(updatedFilters, 'updatefilters');
  };

  const clearFilter = (filterKey) => {
    setSelectedFilters(prevFilters => {
      const updatedFilters = { ...prevFilters, [filterKey]: [] };
      applyFilters(updatedFilters);
      return updatedFilters;
    });
  };
  
  return (
    <div className="search-filters">
      <form className="filter-form">
        {Object.entries(filterOptions).map(([key, options]) => (
          <div className="filter" key={key}>
            <label htmlFor={key} className={selectedFilters[key]?.length > 0 ? 'label' : 'hidden'}>{key}</label>
            <Select
              id={key}
              name={key}
              options={options}
              value={selectedFilters[key]}
              onChange={(selectedOptions) => handleChange(selectedOptions, key)}
              isMulti
              placeholder={`${key}`}
              components={{
                Option: CustomOption
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
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div>{children}</div>
      {props.isSelected && (
        <button className="clear-filter-btn" onClick={() => props.data.clearFilter(props.data.filterKey)}>
          <ClearIcon />
        </button>
      )}
    </div>
  </components.Option>
);

export default SearchFilters;
