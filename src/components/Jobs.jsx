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
import CardActions from "@mui/material/CardActions";

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
    <Grid
      container
      spacing={3}
      justifyContent="center"
      style={{
        marginLeft: "auto",
        marginRight: "auto",
        maxWidth: "1200px",
        paddingLeft: "10px",
        paddingRight: "10px",
      }}
    >
      {filteredJobListings.map((job, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card
            sx={{
              borderRadius: 5,
              height: "100%",
              width: "350px",
              margin: "10px",
            }}
          >
            <CardContent style={{ padding: "20px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  src={job.logoUrl}
                  alt={job.companyName}
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    marginRight: 10,
                  }}
                />
                <div>
                  <Typography variant="h4" component="div">
                    {job.companyName}
                  </Typography>
                  <Typography variant="h6" component="div">
                    {job.location.toUpperCase()}
                  </Typography>{" "}
                  {/* Capitalize location */}
                </div>
              </div>
              {job.minJdSalary !== null && job.maxJdSalary !== null && (
                <Typography
                  variant="body2"
                  component="div"
                  style={{ marginTop: 10 }}
                >
                  Estimated Salary: ₹{job.minJdSalary} - {job.maxJdSalary} LPA{" "}
                  <span role="img" aria-label="Green Tick">
                    ✅
                  </span>
                </Typography>
              )}
              {job.jobDetailsFromCompany && (
                <>
                  <Typography
                    variant="body2"
                    component="div"
                    style={{ marginTop: 10, fontWeight: "bold" }}
                  >
                    About the Company:
                  </Typography>
                  <Typography
                    variant="body2"
                    component="div"
                    style={{ marginTop: 5, fontWeight: "bold" }}
                  >
                    About Us
                  </Typography>
                  <Typography
                    variant="body2"
                    component="div"
                    style={{ marginTop: 5 }}
                  >
                    {truncateDescription(job.jobDetailsFromCompany)}
                    {job.jobDetailsFromCompany.length > 25 && (
                      <span
                        style={{ cursor: "pointer", color: "blue" }}
                        onClick={() => openJobModal(job)}
                      >
                        View More
                      </span>
                    )}
                  </Typography>
                </>
              )}
              <Typography
                variant="body2"
                component="div"
                style={{ marginTop: 5 }}
              >
                Minimum Experience <br /> {job.minExp} years
              </Typography>
            </CardContent>
            <CardActions
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                marginTop: "auto",
                padding: "20px",
              }}
            >
              <Button
                variant="contained"
                style={{ margin: 5 }}
                fullWidth
                color="primary"
                startIcon={
                  <span role="img" aria-label="Thunder">
                    ⚡️
                  </span>
                }
              >
                Easy Apply
              </Button>
              <Button
                variant="contained"
                style={{ marginTop: 10 }}
                fullWidth
                color="secondary"
                endIcon={
                  <span role="img" aria-label="Unlock">
                    🔓
                  </span>
                }
              >
                Unlock Referral
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
      <div
        ref={loaderRef}
        style={{ marginTop: "20px", marginBottom: "20px", textAlign: "center" }}
      >
        {" "}
        {/* Add margin top and bottom for the loader */}
        {loading && <CircularProgress />}
      </div>
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
      <DialogTitle>{job.jobRole.toUpperCase()}</DialogTitle>{" "}
      {/* Capitalize modal title */}
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
