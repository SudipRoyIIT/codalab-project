// Achievements.jsx - Updated with Announcements Style
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
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  CalendarToday as CalendarIcon,
  EmojiEvents as TrophyIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  Groups as GroupsIcon,
  DateRange as DateRangeIcon,
} from "@mui/icons-material";
import "react-toastify/dist/ReactToastify.css";

// API Base URL
const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3001";

const Achievements = () => {
  // States
  const [loading, setLoading] = useState(true);
  const [achievements, setAchievements] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("");
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    organizedBy: "",
    date: "",
    names: "",
    department: "",
    additionalInfo: "",
  });

  // Fetch achievements with cache handling
  const fetchAchievements = async (title = "") => {
    setLoading(true);
    try {
      const endpoint = title 
        ? `${BASE_URL}/api/Admin/private/getSelectedAchievement?title=${title}`
        : `${BASE_URL}/api/Admin/private/getSelectedAchievement`;
      
      console.log("📡 Fetching achievements from:", endpoint);
      
      // Cache busting parameter
      const timestamp = new Date().getTime();
      const url = `${endpoint}?_=${timestamp}`;
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
      });

      console.log("📊 Response status:", response.status);

      // Handle 304 Not Modified
      if (response.status === 304) {
        console.log("⚠️ 304 - Data unchanged");
        toast.info("No new achievements found");
        setAchievements([]);
        return;
      }

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Achievements data:", data);
        
        if (Array.isArray(data)) {
          setAchievements(data);
          if (data.length === 0) {
            toast.info("No achievements found in database");
          }
        } else {
          console.warn("⚠️ Unexpected data format:", data);
          setAchievements([]);
        }
      } else {
        const errorText = await response.text();
        console.error("❌ API Error:", errorText);
        toast.error("Failed to load achievements");
        setAchievements([]);
      }
    } catch (error) {
      console.error("💥 Network error:", error);
      toast.error("Cannot connect to server");
      
      // Sample data for testing
      const sampleData = [
        {
          _id: "1",
          achievement: {
            title: "Best Paper Award",
            organised_by: "IEEE Conference",
            date: new Date().toISOString(),
            additionalInfo: "Received for outstanding research"
          },
          name: ["John Doe", "Jane Smith"],
          department: "Computer Science",
          createdAt: new Date().toISOString()
        },
        {
          _id: "2",
          achievement: {
            title: "Research Grant",
            organised_by: "Government of India",
            date: new Date(Date.now() - 86400000).toISOString(),
            additionalInfo: "5 lakh grant for AI research"
          },
          name: ["Alice Johnson"],
          department: "Artificial Intelligence",
          createdAt: new Date(Date.now() - 86400000).toISOString()
        }
      ];
      setAchievements(sampleData);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchAchievements();
  }, []);

  // Handle search
  const handleSearch = () => {
    fetchAchievements(searchTitle);
    setPage(0);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchTitle("");
    fetchAchievements();
    setPage(0);
  };

  // Handle date filter
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setPage(0);
  };

  // Clear date filter
  const handleClearDateFilter = () => {
    setSelectedDate("");
    setPage(0);
  };

  // Handle form input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Open dialog for add/edit/delete
  const handleOpenDialog = (mode, achievement = null) => {
    console.log(`Opening ${mode} dialog for:`, achievement);
    
    setDialogMode(mode);
    setSelectedAchievement(achievement);
    
    if (mode === 'edit' && achievement) {
      setFormData({
        title: achievement.achievement?.title || "",
        organizedBy: achievement.achievement?.organised_by || "",
        date: achievement.achievement?.date ? 
              new Date(achievement.achievement.date).toISOString().split('T')[0] : 
              "",
        names: achievement.name?.join(", ") || "",
        department: achievement.department || "",
        additionalInfo: achievement.achievement?.additionalInfo || "",
      });
    } else if (mode === 'add') {
      setFormData({
        title: "",
        organizedBy: "",
        date: new Date().toISOString().split('T')[0],
        names: "",
        department: "",
        additionalInfo: "",
      });
    } else if (mode === 'delete' && achievement) {
      setFormData({
        title: achievement.achievement?.title || "",
        organizedBy: achievement.achievement?.organised_by || "",
        date: achievement.achievement?.date ? 
              new Date(achievement.achievement.date).toISOString().split('T')[0] : 
              "",
        names: achievement.name?.join(", ") || "",
        department: achievement.department || "",
        additionalInfo: achievement.achievement?.additionalInfo || "",
      });
    }
    
    setDialogOpen(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setFormData({
      title: "",
      organizedBy: "",
      date: "",
      names: "",
      department: "",
      additionalInfo: "",
    });
    setSelectedAchievement(null);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log(`Submitting ${dialogMode} form:`, formData);
    
    // Validation
    const requiredFields = ['title', 'organizedBy', 'date', 'names', 'department'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0 && dialogMode !== 'delete') {
      toast.error(`Please fill in: ${missingFields.join(', ')}`);
      return;
    }

    const payload = {
      achievement: {
        title: formData.title,
        organised_by: formData.organizedBy,
        date: new Date(formData.date).toISOString(),
        additionalInfo: formData.additionalInfo,
      },
      name: formData.names.split(",").map(name => name.trim()).filter(name => name !== ""),
      department: formData.department,
    };

    try {
      let endpoint = '';
      let method = '';
      
      if (dialogMode === 'add') {
        endpoint = `${BASE_URL}/api/Admin/private/createAchievement`;
        method = 'POST';
      } else if (dialogMode === 'edit' && selectedAchievement) {
        endpoint = `${BASE_URL}/api/Admin/private/updateAchievement/${selectedAchievement._id}`;
        method = 'PUT';
      } else if (dialogMode === 'delete' && selectedAchievement) {
        endpoint = `${BASE_URL}/api/Admin/private/deleteAchievement/${selectedAchievement._id}`;
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
        toast.success(`Achievement ${action} successfully!`);
        handleCloseDialog();
        fetchAchievements(searchTitle);
      } else {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        toast.error(`Failed to ${dialogMode} achievement`);
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
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  // Filter achievements by date
  const filteredAchievements = selectedDate 
    ? achievements.filter(achievement => {
        const achievementDate = new Date(achievement.achievement?.date).toISOString().split('T')[0];
        return achievementDate === selectedDate;
      })
    : achievements;

  // Statistics
  const totalAchievements = achievements.length;
  const todayAchievements = achievements.filter(a => {
    const achievementDate = new Date(a.achievement?.date).toISOString().split('T')[0];
    const today = new Date().toISOString().split('T')[0];
    return achievementDate === today;
  }).length;

  const uniqueDepartments = [...new Set(achievements.map(a => a.department))].length;

  return (
    <Box sx={styles.container}>
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header */}
      <Box sx={styles.header}>
        <Box>
          <Typography variant="h4" sx={styles.title}>
            <TrophyIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Achievements
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {filteredAchievements.length} achievement(s) found
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
              placeholder="Search by title..."
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={3}>
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
          <Grid item xs={12} md={5}>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              {(searchTitle || selectedDate) && (
                <Button
                  variant="outlined"
                  onClick={() => {
                    handleClearSearch();
                    handleClearDateFilter();
                  }}
                  size="small"
                >
                  Clear Filters
                </Button>
              )}
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog('add')}
                sx={styles.addButton}
              >
                New Achievement
              </Button>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={() => fetchAchievements(searchTitle)}
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
              <TrophyIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4">{totalAchievements}</Typography>
              <Typography variant="body2" color="text.secondary">
                Total Achievements
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={styles.statCard}>
            <Box sx={styles.statCardContent}>
              <CalendarIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4">{todayAchievements}</Typography>
              <Typography variant="body2" color="text.secondary">
                Today's Achievements
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={styles.statCard}>
            <Box sx={styles.statCardContent}>
              <GroupsIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4">{uniqueDepartments}</Typography>
              <Typography variant="body2" color="text.secondary">
                Departments
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={styles.statCard}>
            <Box sx={styles.statCardContent}>
              <FilterIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h4">{filteredAchievements.length}</Typography>
              <Typography variant="body2" color="text.secondary">
                Filtered Results
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Achievements Table */}
      <TableContainer component={Paper} sx={styles.tablePaper}>
        {loading ? (
          <Box sx={styles.loadingContainer}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Loading achievements...
            </Typography>
          </Box>
        ) : filteredAchievements.length === 0 ? (
          <Box sx={styles.noDataContainer}>
            <TrophyIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              No achievements found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {searchTitle || selectedDate
                ? `No achievements match your filters`
                : "No achievements available. Add your first achievement!"}
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog('add')}
              sx={{ mt: 2 }}
            >
              ADD FIRST ACHIEVEMENT
            </Button>
          </Box>
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={styles.tableHeader}>Title</TableCell>
                  <TableCell sx={styles.tableHeader}>Organized By</TableCell>
                  <TableCell sx={styles.tableHeader}>Date</TableCell>
                  <TableCell sx={styles.tableHeader}>Participants</TableCell>
                  <TableCell sx={styles.tableHeader}>Department</TableCell>
                  <TableCell sx={styles.tableHeader} align="center">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAchievements
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((achievement) => (
                    <TableRow key={achievement._id} hover>
                      <TableCell>
                        <Typography variant="body1" fontWeight={500}>
                          {achievement.achievement?.title}
                        </Typography>
                        {achievement.achievement?.additionalInfo && (
                          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                            {achievement.achievement.additionalInfo}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {achievement.achievement?.organised_by}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={<CalendarIcon />}
                          label={formatDate(achievement.achievement?.date)}
                          size="small"
                          variant="outlined"
                          sx={{ cursor: 'pointer' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" flexWrap="wrap" gap={0.5}>
                          {achievement.name?.map((name, index) => (
                            <Tooltip key={index} title={name}>
                              <Chip
                                icon={<PersonIcon />}
                                label={name}
                                size="small"
                                sx={{ maxWidth: '120px' }}
                              />
                            </Tooltip>
                          ))}
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={<SchoolIcon />}
                          label={achievement.department}
                          color="primary"
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Tooltip title="Edit">
                            <IconButton
                              onClick={() => handleOpenDialog('edit', achievement)}
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
                              onClick={() => handleOpenDialog('delete', achievement)}
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
              count={filteredAchievements.length}
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
          {dialogMode === 'add' && 'Add New Achievement'}
          {dialogMode === 'edit' && 'Edit Achievement'}
          {dialogMode === 'delete' && 'Delete Achievement'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {dialogMode === 'delete' ? (
              <Box>
                <Alert severity="warning" sx={{ mb: 2 }}>
                  Are you sure you want to delete this achievement? This action cannot be undone.
                </Alert>
                {selectedAchievement && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body1" gutterBottom>
                      <strong>Title:</strong> {selectedAchievement.achievement?.title}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Date:</strong> {formatDate(selectedAchievement.achievement?.date)}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Participants:</strong> {selectedAchievement.name?.join(', ')}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Department:</strong> {selectedAchievement.department}
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
                    label="Achievement Title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Best Paper Award, Research Grant"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Organized By"
                    name="organizedBy"
                    value={formData.organizedBy}
                    onChange={handleInputChange}
                    placeholder="e.g., IEEE, Government of India"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Date"
                    name="date"
                    type="date"
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
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Participants (comma-separated)"
                    name="names"
                    value={formData.names}
                    onChange={handleInputChange}
                    helperText="Enter names separated by commas"
                    placeholder="e.g., John Doe, Jane Smith"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    placeholder="e.g., Computer Science, AI"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Additional Information"
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleInputChange}
                    multiline
                    rows={3}
                    placeholder="Optional: Additional details about the achievement"
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
              {dialogMode === 'add' && 'Add Achievement'}
              {dialogMode === 'edit' && 'Update Achievement'}
              {dialogMode === 'delete' && 'Delete Achievement'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

// Styles (same as announcements)
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

export default Achievements;