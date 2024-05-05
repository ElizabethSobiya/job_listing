import React, { useEffect, useState, useRef } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

function JobListingCards() {
  const [jobListings, setJobListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const loaderRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, [limit, offset]);

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
  }, []);

  const handleObserver = (entries) => {
    const target = entries[0];
    if (target.isIntersecting) {
      setOffset((prevOffset) => prevOffset + limit);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const body = JSON.stringify({ limit, offset });
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body
    };

    try {
      const response = await fetch("https://api.weekday.technology/adhoc/getSampleJdJSON", requestOptions);
      if (response.ok) {
        const data = await response.json();
        setJobListings((prevListings) => [...prevListings, ...data.jdList]);
      } else {
        console.error("Failed to fetch job listings");
      }
    } catch (error) {
      console.error("Error fetching job listings:", error);
    } finally {
      setLoading(false);
    }
  };

  const openJobModal = (job) => {
    setSelectedJob(job);
    setOpenModal(true);
  };

  const closeJobModal = () => {
    setOpenModal(false);
  };

  return (
    <Grid container spacing={4}  >
      {jobListings.map((job, index) => (
        <Grid item xs={12} sm={6} md={3} xl={2} lg={3} key={index}>
          <JobCard job={job} openModal={openJobModal} />
        </Grid>
      ))}
      <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
        {loading && <CircularProgress />}
      </Grid>
      <div ref={loaderRef}></div>
      <JobModal open={openModal} onClose={closeJobModal} job={selectedJob} />
    </Grid>
  );
}

function JobCard({ job, openModal }) {
  if (!job) return null;
  const { companyName, location, jobDetailsFromCompany, jobRole, minExp, maxExp, minJdSalary, maxJdSalary, salaryCurrencyCode, logoUrl } = job;

  const truncateDescription = (description) => {
    const words = description.split(' ');
    return words.slice(0, 25).join(' ');
  };

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
          <>
            <Typography variant="body2" component="p">
              {truncateDescription(jobDetailsFromCompany)}
            </Typography>
            {jobDetailsFromCompany.length > 25 &&
              <span style={{ cursor: 'pointer' }} onClick={() => openModal(job)}>View More</span>
            }
          </>
        )}
      </CardContent>
    </Card>
  );
}

function JobModal({ open, onClose, job }) {
  if (!job || !job.jobDetailsFromCompany) return null;

  const { jobDetailsFromCompany } = job;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{job.jobRole}</DialogTitle>
      <DialogContent>
        <Typography>{jobDetailsFromCompany}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default JobListingCards;
