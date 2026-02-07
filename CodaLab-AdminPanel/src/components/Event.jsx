// Event.jsx - Material-UI Version
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  InputAdornment,
  Link,
  Tooltip,
  Stack,
  Card,
  CardContent,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  CalendarToday as CalendarIcon,
  Event as EventIcon,
  Refresh as RefreshIcon,
  DateRange as DateRangeIcon,
  Link as LinkIcon,
  FilterList as FilterIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import "react-toastify/dist/ReactToastify.css";

// API Base URL
const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3001";

const Event = () => {
  // States
  const [loading, setLoading] = useState(false);
  const [eventsData, setEventsData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState(""); // 'add', 'edit', 'delete'
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    date: "",
    eventDescription: "",
    url: "",
  });

  // Fetch events data
  const fetchEventsData = async (date = "") => {
    setLoading(true);
    try {
      let endpoint = `${BASE_URL}/api/Admin/private/getselectevents`;
      
      // Add date parameter if provided
      if (date) {
        endpoint = `${endpoint}?date=${date}`;
      }
      
      // Add cache busting
      const url = `${endpoint}${date ? '&' : '?'}_=${new Date().getTime()}`;
      
      console.log("📡 Fetching events from:", url);
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
      });

      console.log("📊 Response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Events data received:", data);
        
        let finalData = [];
        if (Array.isArray(data)) {
          finalData = data;
        } else if (data && typeof data === 'object') {
          if (Array.isArray(data.data)) {
            finalData = data.data;
          } else if (Array.isArray(data.events)) {
            finalData = data.events;
          } else if (Array.isArray(data.result)) {
            finalData = data.result;
          }
        }
        
        // Ensure date is properly formatted
        const cleanedData = finalData.map(item => ({
          ...item,
          date: item.date || ""
        }));
        
        setEventsData(cleanedData);
        setFilteredData(cleanedData);
        
        if (cleanedData.length === 0) {
          toast.info(date ? `No events found for ${date}` : "No events found in database");
        } else {
          toast.success(`Loaded ${cleanedData.length} events`);
        }
      } else {
        const errorText = await response.text();
        console.error("❌ API Error:", errorText);
        toast.error("Failed to load events");
        setEventsData([]);
        setFilteredData([]);
      }
    } catch (error) {
      console.error("💥 Network error:", error);
      toast.error("Cannot connect to server");
      
      // Sample data for testing
      const sampleData = [
        {
          _id: "1",
          date: new Date().toISOString().split('T')[0],
          eventDescription: "Workshop on AI and Machine Learning",
          url: "https://example.com/ai-workshop",
          createdAt: new Date().toISOString()
        },
        {
          _id: "2",
          date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          eventDescription: "Research Paper Submission Deadline",
          url: "https://example.com/submission",
          createdAt: new Date(Date.now() - 86400000).toISOString()
        }
      ];
      setEventsData(sampleData);
      setFilteredData(sampleData);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch - get all events
  useEffect(() => {
    fetchEventsData();
  }, []);

  // Fetch when date changes
  useEffect(() => {
    if (selectedDate) {
      fetchEventsData(selectedDate);
    } else {
      fetchEventsData();
    }
  }, [selectedDate]);

  // Handle date filter change
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setPage(0);
  };

  // Clear date filter
  const handleClearDateFilter = () => {
    setSelectedDate("");
    setPage(0);
    fetchEventsData();
  };

  // Handle form input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Open dialog for add/edit/delete
  const handleOpenDialog = (mode, event = null) => {
    console.log(`Opening ${mode} dialog for:`, event);
    
    setDialogMode(mode);
    setSelectedEvent(event);
    
    if (mode === 'edit' && event) {
      setFormData({
        date: event.date || "",
        eventDescription: event.eventDescription || "",
        url: event.url || "",
      });
    } else if (mode === 'add') {
      setFormData({
        date: selectedDate || new Date().toISOString().split('T')[0],
        eventDescription: "",
        url: "",
      });
    } else if (mode === 'delete' && event) {
      setFormData({
        date: event.date || "",
        eventDescription: event.eventDescription || "",
        url: event.url || "",
      });
    }
    
    setDialogOpen(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setFormData({
      date: "",
      eventDescription: "",
      url: "",
    });
    setSelectedEvent(null);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log(`Submitting ${dialogMode} form:`, formData);
    
    // Validation
    if (dialogMode !== 'delete') {
      if (!formData.date || !formData.eventDescription || !formData.url) {
        toast.error("Please fill in all required fields");
        return;
      }
    }

    try {
      let endpoint = '';
      let method = '';
      let payload = {};
      
      if (dialogMode === 'add') {
        endpoint = `${BASE_URL}/api/Admin/private/createEvent`;
        method = 'POST';
        payload = formData;
      } else if (dialogMode === 'edit' && selectedEvent) {
        endpoint = `${BASE_URL}/api/Admin/private/updateEvent/${selectedEvent._id}`;
        method = 'PUT';
        payload = formData;
      } else if (dialogMode === 'delete' && selectedEvent) {
        endpoint = `${BASE_URL}/api/Admin/private/deleteEvent/${selectedEvent._id}`;
        method = 'DELETE';
      }

      console.log(`Making ${method} request to:`, endpoint);
      console.log('Payload:', payload);

      const response = await fetch(endpoint, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
        body: method !== 'DELETE' ? JSON.stringify(payload) : undefined,
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        const action = dialogMode === 'add' ? 'added' : 
                     dialogMode === 'edit' ? 'updated' : 'deleted';
        toast.success(`Event ${action} successfully!`);
        handleCloseDialog();
        
        // Refresh data
        if (selectedDate) {
          fetchEventsData(selectedDate);
        } else {
          fetchEventsData();
        }
      } else {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        toast.error(`Failed to ${dialogMode} event`);
      }
    } catch (error) {
      console.error(`${dialogMode} error:`, error);
      toast.error(`Network error: ${error.message}`);
    }
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Format date
  const formatDate = (dateString) => {
    try {
      if (!dateString) return "No date";
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  // Statistics
  const totalEvents = eventsData.length;
  
  const todayEvents = eventsData.filter(event => {
    try {
      if (!event.date) return false;
      const eventDate = new Date(event.date).toISOString().split('T')[0];
      const today = new Date().toISOString().split('T')[0];
      return eventDate === today;
    } catch {
      return false;
    }
  }).length;

  const upcomingEvents = eventsData.filter(event => {
    try {
      if (!event.date) return false;
      const eventDate = new Date(event.date);
      const today = new Date();
      return eventDate > today;
    } catch {
      return false;
    }
  }).length;

  return (
    <Box sx={styles.container}>
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header */}
      <Box sx={styles.header}>
        <Box>
          <Typography variant="h4" sx={styles.title}>
            <EventIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Events Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {filteredData.length} event(s) found
          </Typography>
        </Box>
        <Box>
          <Chip
            icon={<CalendarIcon />}
            label={formatDate(new Date().toISOString())}
            color="primary"
            variant="outlined"
          />
        </Box>
      </Box>

      {/* Filter and Actions Bar */}
      <Paper sx={styles.actionBar}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              type="date"
              label="Filter by Date"
              value={selectedDate}
              onChange={handleDateChange}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DateRangeIcon />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              {selectedDate && (
                <Button
                  variant="outlined"
                  onClick={handleClearDateFilter}
                  size="small"
                >
                  Clear Filter
                </Button>
              )}
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog('add')}
                sx={styles.addButton}
              >
                New Event
              </Button>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={() => selectedDate ? fetchEventsData(selectedDate) : fetchEventsData()}
              >
                Refresh
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={styles.statCard}>
            <Box sx={styles.statCardContent}>
              <EventIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4">{totalEvents}</Typography>
              <Typography variant="body2" color="text.secondary">
                Total Events
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={styles.statCard}>
            <Box sx={styles.statCardContent}>
              <CalendarIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4">{todayEvents}</Typography>
              <Typography variant="body2" color="text.secondary">
                Today's Events
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={styles.statCard}>
            <Box sx={styles.statCardContent}>
              <DateRangeIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4">{upcomingEvents}</Typography>
              <Typography variant="body2" color="text.secondary">
                Upcoming Events
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={styles.statCard}>
            <Box sx={styles.statCardContent}>
              <FilterIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h4">{filteredData.length}</Typography>
              <Typography variant="body2" color="text.secondary">
                Filtered Results
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Events Table */}
      <TableContainer component={Paper} sx={styles.tablePaper}>
        {loading ? (
          <Box sx={styles.loadingContainer}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Loading events...
            </Typography>
          </Box>
        ) : filteredData.length === 0 ? (
          <Box sx={styles.noDataContainer}>
            <EventIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              No events found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {selectedDate
                ? `No events found for ${formatDate(selectedDate)}`
                : "No events available. Add your first event!"}
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog('add')}
              sx={{ mt: 2 }}
            >
              ADD FIRST EVENT
            </Button>
          </Box>
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={styles.tableHeader}>Date</TableCell>
                  <TableCell sx={styles.tableHeader}>Event Description</TableCell>
                  <TableCell sx={styles.tableHeader}>Link</TableCell>
                  <TableCell sx={styles.tableHeader} align="center">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((event) => (
                    <TableRow key={event._id} hover>
                      <TableCell>
                        <Chip
                          icon={<CalendarIcon />}
                          label={formatDate(event.date)}
                          size="small"
                          variant="outlined"
                          sx={{ cursor: 'pointer' }}
                        />
                        {event.createdAt && (
                          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                            Added: {formatDate(event.createdAt)}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" fontWeight={500}>
                          {event.eventDescription}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {event.url ? (
                          <Link
                            href={event.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            underline="hover"
                            sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                          >
                            <LinkIcon fontSize="small" />
                            View Event Link
                          </Link>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No link provided
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Tooltip title="Edit">
                            <IconButton
                              onClick={() => handleOpenDialog('edit', event)}
                              sx={{
                                color: 'primary.main',
                                '&:hover': {
                                  backgroundColor: 'rgba(67, 97, 238, 0.1)',
                                },
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              onClick={() => handleOpenDialog('delete', event)}
                              sx={{
                                color: 'error.main',
                                '&:hover': {
                                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                },
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </TableContainer>

      {/* Dialog for Add/Edit/Delete */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {dialogMode === 'add' && 'Add New Event'}
          {dialogMode === 'edit' && 'Edit Event'}
          {dialogMode === 'delete' && 'Delete Event'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {dialogMode === 'delete' ? (
              <Box>
                <Alert severity="warning" sx={{ mb: 2 }}>
                  Are you sure you want to delete this event? This action cannot be undone.
                </Alert>
                {selectedEvent && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body1" gutterBottom>
                      <strong>Date:</strong> {formatDate(selectedEvent.date)}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Description:</strong> {selectedEvent.eventDescription}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Link:</strong>{" "}
                      <Link
                        href={selectedEvent.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {selectedEvent.url}
                      </Link>
                    </Typography>
                  </Box>
                )}
              </Box>
            ) : (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    type="date"
                    label="Event Date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    label="Event Description"
                    name="eventDescription"
                    value={formData.eventDescription}
                    onChange={handleInputChange}
                    multiline
                    rows={4}
                    placeholder="Enter event details..."
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <InfoIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    label="Event Link (URL)"
                    name="url"
                    value={formData.url}
                    onChange={handleInputChange}
                    type="url"
                    placeholder="https://example.com/event"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LinkIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              color={dialogMode === 'delete' ? 'error' : 'primary'}
            >
              {dialogMode === 'add' && 'Add Event'}
              {dialogMode === 'edit' && 'Update Event'}
              {dialogMode === 'delete' && 'Delete Event'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

// Styles
const styles = {
  container: {
    p: 3,
    backgroundColor: 'background.default',
    minHeight: '100vh',
  },
  header: {
    mb: 4,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 2,
  },
  title: {
    fontWeight: 700,
    color: 'var(--primary-color)',
  },
  actionBar: {
    p: 2,
    mb: 3,
    backgroundColor: 'background.paper',
    borderRadius: 'var(--border-radius-md)',
    boxShadow: 'var(--shadow-sm)',
  },
  addButton: {
    backgroundColor: 'var(--primary-color)',
    '&:hover': {
      backgroundColor: 'var(--secondary-color)',
    },
  },
  statCard: {
    p: 3,
    borderRadius: 'var(--border-radius-md)',
    boxShadow: 'var(--shadow-sm)',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'translateY(-2px)',
    },
  },
  statCardContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  tablePaper: {
    borderRadius: 'var(--border-radius-md)',
    boxShadow: 'var(--shadow-sm)',
    overflow: 'hidden',
    minHeight: '400px',
  },
  tableHeader: {
    fontWeight: 600,
    backgroundColor: 'var(--header-bg)',
    color: 'var(--dark-color)',
    fontSize: '0.875rem',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    py: 10,
  },
  noDataContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    py: 8,
    textAlign: 'center',
  },
};

export default Event;