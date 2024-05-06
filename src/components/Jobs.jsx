import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import { fetchJobListings } from "../redux/actions";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

function JobListingCards({ jobListings, loading, fetchJobListings, filters }) {
  const [openModal, setOpenModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [filteredJobListings, setFilteredJobListings] = useState([]);
  const loaderRef = useRef(null);

  useEffect(() => {
    fetchJobListings(limit, offset);
  }, [fetchJobListings, limit, offset]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "20px",
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

  useEffect(() => {
    // Reset limit and offset when filters change
    setLimit(10);
    setOffset(0);
  }, [filters]);

  const handleObserver = (entries) => {
    const target = entries[0];
    if (target.isIntersecting) {
      setLimit((prevLimit) => prevLimit + 5);
    }
  };

  useEffect(() => {
    const newFilteredJobListings = jobListings.filter((job) => {
      // Check if the job matches all selected filters
      return Object.entries(filters).every(([filterKey, selectedOptions]) => {
        if (!selectedOptions) return true; // If no options selected for a filter, include all jobs
        return selectedOptions.some(
          (selectedOption) => selectedOption.value === job[filterKey]
        );
      });
    });
    setFilteredJobListings(newFilteredJobListings);
  }, [jobListings, filters]);

  const openJobModal = (job) => {
    setSelectedJob(job);
    setOpenModal(true);
  };

  const closeJobModal = () => {
    setOpenModal(false);
  };

  const truncateDescription = (description) => {
    const words = description.split(" ");
    return words.slice(0, 25).join(" ");
  };

  return (
    <Grid container spacing={4}>
      {filteredJobListings.map((job, index) => (
        <Grid item xs={12} sm={6} md={3} xl={2} lg={3} key={index}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                {job.jobRole}
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                {job.companyName && `${job.companyName} - `}
                {job.location}
              </Typography>
              {job.minExp && (
                <Typography variant="body2" component="p">
                  Min Experience: {job.minExp} years
                </Typography>
              )}
              {job.maxExp && (
                <Typography variant="body2" component="p">
                  Max Experience: {job.maxExp} years
                </Typography>
              )}
              {job.minJdSalary !== null && job.maxJdSalary !== null && (
                <Typography variant="body2" component="p">
                  Salary Range: {job.minJdSalary} - {job.maxJdSalary}{" "}
                  {job.salaryCurrencyCode}
                </Typography>
              )}
              {job.jobDetailsFromCompany && (
                <>
                  <Typography variant="body2" component="p">
                    {truncateDescription(job.jobDetailsFromCompany)}
                  </Typography>
                  {job.jobDetailsFromCompany.length > 25 && (
                    <span
                      style={{ cursor: "pointer" }}
                      onClick={() => openJobModal(job)}
                    >
                      View More
                    </span>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
      <div ref={loaderRef}></div>
      {loading && <CircularProgress />}
      <JobModal open={openModal} onClose={closeJobModal} job={selectedJob} />
    </Grid>
  );
}

const mapStateToProps = (state) => ({
  jobListings: state.listings,
  loading: state.loading,
  filters: state.filters,
});

const mapDispatchToProps = (dispatch) => ({
  fetchJobListings: (limit, offset) =>
    dispatch(fetchJobListings(limit, offset)),
});

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

export default connect(mapStateToProps, mapDispatchToProps)(JobListingCards);
