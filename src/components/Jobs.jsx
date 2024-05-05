import React, { useEffect, useState, useRef } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';

function JobListingCards() {
  const [jobListings, setJobListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(10); // Initial limit
  const [offset, setOffset] = useState(0);
  const loaderRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, [limit, offset]); // Fetch data whenever limit or offset changes

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 1.0,
    };

    const observer = new IntersectionObserver(handleObserver, options);
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, []); // Add IntersectionObserver when component mounts

  const handleObserver = (entries) => {
    const target = entries[0];
    if (target.isIntersecting) {
      // Load more data when loader element is intersecting with viewport
      setOffset((prevOffset) => prevOffset + limit);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const body = JSON.stringify({ limit, offset });
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body,
    };

    try {
      const response = await fetch('https://api.weekday.technology/adhoc/getSampleJdJSON', requestOptions);
      if (response.ok) {
        const data = await response.json();
        setJobListings((prevListings) => [...prevListings, ...data.jdList]);
      } else {
        console.error('Failed to fetch job listings');
      }
    } catch (error) {
      console.error('Error fetching job listings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container spacing={4}>
      {jobListings.map((job, index) => (
        <Grid item xs={12} sm={6} md={3} lg={3} key={index}>
          <JobCard job={job} />
        </Grid>
      ))}
      {loading && (
        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Grid>
      )}
      <div ref={loaderRef}></div> {/* Loader element */}
    </Grid>
  );
}

function JobCard({ job }) {
  const { companyName, location, jobDetailsFromCompany, jobRole, minExp, maxExp, minJdSalary, maxJdSalary, salaryCurrencyCode, logoUrl } = job;

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div">
          {jobRole}
        </Typography>
        <Typography color="textSecondary" gutterBottom>
          {companyName && `${companyName} - `}{location}
        </Typography>
        {minExp && (
          <Typography variant="body2" component="p">
            Min Experience: {minExp} years
          </Typography>
        )}
        {maxExp && (
          <Typography variant="body2" component="p">
            Max Experience: {maxExp} years
          </Typography>
        )}
        {(minJdSalary !== null && maxJdSalary !== null) && (
          <Typography variant="body2" component="p">
            Salary Range: {minJdSalary} - {maxJdSalary} {salaryCurrencyCode}
          </Typography>
        )}
        {jobDetailsFromCompany && (
          <Typography variant="body2" component="p">
            Description: {jobDetailsFromCompany}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

export default JobListingCards;
