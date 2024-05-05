import React, { useState } from 'react';
import Select from 'react-select';
import './style.css';

function SearchFilters({ applyFilters }) {
  const options = {
    minExperience: [
      { value: '0-1 years', label: '0-1 years' },
      { value: '1-3 years', label: '1-3 years' },
      { value: '3-5 years', label: '3-5 years' }
    ],
    companyName: [
      { value: 'Company A', label: 'Company A' },
      { value: 'Company B', label: 'Company B' },
      { value: 'Company C', label: 'Company C' }
    ],
    location: [
      { value: 'New York', label: 'New York' },
      { value: 'San Francisco', label: 'San Francisco' },
      { value: 'London', label: 'London' }
    ],
    remote: [
      { value: 'Remote', label: 'Remote' },
      { value: 'On-site', label: 'On-site' }
    ],
    techStack: [
      { value: 'JavaScript', label: 'JavaScript' },
      { value: 'Python', label: 'Python' },
      { value: 'Java', label: 'Java' }
    ],
    role: [
      { value: 'Frontend Developer', label: 'Frontend Developer' },
      { value: 'Backend Developer', label: 'Backend Developer' },
      { value: 'Full Stack Developer', label: 'Full Stack Developer' }
    ],
    minBasePay: [
      { value: '4l', label: '4l' },
      { value: '6l', label: '6l' },
      { value: '8l', label: '8l' }
    ]
  };

  const [selectedFilters, setSelectedFilters] = useState({});

  const handleChange = (selectedOptions, filterKey) => {
    setSelectedFilters({ ...selectedFilters, [filterKey]: selectedOptions });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    applyFilters(selectedFilters);
  };

  return (
    <div className="search-filters">
      <form onSubmit={handleSubmit} className="filter-form">
        {Object.keys(options).map((key) => (
          <div className="filter" key={key}>
            <label htmlFor={key} className={selectedFilters[key]?.length > 0 ? 'label' : 'hidden'}>{key}</label>
            <Select
              id={key}
              name={key}
              options={options[key]}
              value={selectedFilters[key]}
              onChange={(selectedOptions) => handleChange(selectedOptions, key)}
              isMulti
              placeholder={`Select ${key}`}
            />
          </div>
        ))}
      </form>
    </div>
  );
}

export default SearchFilters;
