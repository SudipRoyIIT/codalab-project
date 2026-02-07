import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Tooltip,
  Stack,
  Avatar,
  Card,
  CardContent,
  CardActions,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  CalendarToday as CalendarIcon,
  School as SchoolIcon,
  Refresh as RefreshIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  ArrowDropDown as ArrowDropDownIcon,
  FilterList as FilterIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  Domain as DomainIcon,
  Business as BusinessIcon,
  Schedule as ScheduleIcon,
  LocationCity as LocationCityIcon,
} from "@mui/icons-material";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3001";

const Interns = () => {
  // Navigation
  const navigate = useNavigate();

  // States
  const [loading, setLoading] = useState(false);
  const [internsData, setInternsData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("");
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [viewMode, setViewMode] = useState("table");
  const [activeTab, setActiveTab] = useState("all");

  // Menu states
  const [currentMenuAnchor, setCurrentMenuAnchor] = useState(null);
  const [graduatedMenuAnchor, setGraduatedMenuAnchor] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    enrolledIn: "Intern",
    graduating_year: "",
    university_name: "",
    degree: "",
    internship_domain: "",
    duration: "",
    branch: "",
    info: "",
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Fetch all interns
  const fetchData = async () => {
    setLoading(true);
    try {
      const userRole = localStorage.getItem("userInfo");
      const afApi = userRole === "admin" ? "Admin" : "Subadmin";
      
      const url = `${BASE_URL}/api/${afApi}/private/getGraduatedStudents?name=${searchQuery}&_=${Date.now()}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
      });

      if (response.ok) {
        const data = await response.json();
        const interns = data.filter((item) => item.enrolledIn === "Intern");
        setInternsData(interns);
        
        if (interns.length === 0) {
          toast.info("No interns found");
        } else {
          toast.success(`Loaded ${interns.length} intern${interns.length > 1 ? 's' : ''}`);
        }
      } else {
        const errorText = await response.text();
        toast.error(`Failed to load data: ${response.status} ${errorText}`);
        setInternsData([]);
      }
    } catch (error) {
      console.error("Network error:", error);
      toast.error("Cannot connect to backend server");
      setInternsData([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Open dialog for add/edit/delete
  const handleOpenDialog = (mode, intern = null) => {
    setDialogMode(mode);
    setSelectedIntern(intern);

    if (mode === "edit" && intern) {
      setFormData({
        name: intern.name || "",
        enrolledIn: intern.enrolledIn || "Intern",
        graduating_year: intern.graduating_year || "",
        university_name: intern.university_name || "",
        degree: intern.degree || "",
        internship_domain: intern.internship_domain || "",
        duration: intern.duration || "",
        branch: intern.branch || "",
        info: intern.info || "",
      });
    } else if (mode === "add") {
      setFormData({
        name: "",
        enrolledIn: "Intern",
        graduating_year: "",
        university_name: "",
        degree: "",
        internship_domain: "",
        duration: "",
        branch: "",
        info: "",
      });
    }

    setDialogOpen(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setFormData({
      name: "",
      enrolledIn: "Intern",
      graduating_year: "",
      university_name: "",
      degree: "",
      internship_domain: "",
      duration: "",
      branch: "",
      info: "",
    });
    setSelectedIntern(null);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const userRole = localStorage.getItem("userInfo");
      const afApi = userRole === "admin" ? "Admin" : "Subadmin";
      
      let endpoint = "";
      let method = "";
      let payload = null;

      if (dialogMode === "add") {
        const requiredFields = [
          "name",
          "graduating_year",
          "university_name",
          "degree",
          "internship_domain",
          "duration",
          "branch",
        ];
        const missingFields = requiredFields.filter((field) => !formData[field]);

        if (missingFields.length > 0) {
          toast.error(`Please fill in: ${missingFields.join(", ")}`);
          return;
        }

        endpoint = `${BASE_URL}/api/${afApi}/private/createNewStudent`;
        method = "POST";
        payload = formData;
      } else if (dialogMode === "edit" && selectedIntern) {
        const requiredFields = [
          "name",
          "graduating_year",
          "university_name",
          "degree",
          "internship_domain",
          "duration",
          "branch",
        ];
        const missingFields = requiredFields.filter((field) => !formData[field]);

        if (missingFields.length > 0) {
          toast.error(`Please fill in: ${missingFields.join(", ")}`);
          return;
        }

        endpoint = `${BASE_URL}/api/${afApi}/private/updateNewStudent/${selectedIntern._id}`;
        method = "PUT";
        payload = formData;
      } else if (dialogMode === "delete" && selectedIntern) {
        endpoint = `${BASE_URL}/api/${afApi}/private/deleteNewStudent/${selectedIntern._id}`;
        method = "DELETE";
      }

      const response = await fetch(endpoint, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
        body: method !== "DELETE" ? JSON.stringify(payload) : undefined,
      });

      if (response.ok) {
        const action = dialogMode === "add" ? "added" : dialogMode === "edit" ? "updated" : "deleted";
        toast.success(`Intern ${action} successfully!`);
        handleCloseDialog();
        fetchData();
      } else {
        const errorText = await response.text();
        try {
          const errorJson = JSON.parse(errorText);
          toast.error(errorJson.message || `Failed to ${dialogMode} intern`);
        } catch {
          toast.error(`Failed to ${dialogMode} intern: ${errorText}`);
        }
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

  // Clear filters
  const handleClearFilters = () => {
    setSearchQuery("");
    setPage(0);
    fetchData();
  };

  // Filter interns by search
  const filteredData = internsData.filter((intern) => {
    const name = intern.name || "";
    const university = intern.university_name || "";
    const domain = intern.internship_domain || "";
    const degree = intern.degree || "";
    const branch = intern.branch || "";

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !name.toLowerCase().includes(query) &&
        !university.toLowerCase().includes(query) &&
        !domain.toLowerCase().includes(query) &&
        !degree.toLowerCase().includes(query) &&
        !branch.toLowerCase().includes(query)
      ) {
        return false;
      }
    }

    // Filter by tab
    if (activeTab === "currentYear") {
      const currentYear = new Date().getFullYear();
      return intern.graduating_year === currentYear.toString();
    }
    if (activeTab === "recent") {
      const currentYear = new Date().getFullYear();
      return parseInt(intern.graduating_year) >= currentYear - 1;
    }

    return true;
  });

  // Statistics
  const totalInterns = internsData.length;
  
  // Count unique domains
  const uniqueDomains = [...new Set(internsData.map(i => i.internship_domain))].filter(Boolean);
  
  // Count unique universities
  const uniqueUniversities = [...new Set(internsData.map(i => i.university_name))].filter(Boolean);

  // Current year interns
  const currentYear = new Date().getFullYear();
  const currentYearInterns = internsData.filter(i => 
    i.graduating_year === currentYear.toString()
  ).length;

  return (
    <Box sx={styles.container}>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <Box sx={styles.header}>
        <Box>
          <Typography variant="h4" sx={styles.title}>
            <SchoolIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            People Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {filteredData.length} intern(s) found
          </Typography>
        </Box>
        <Box>
          <Chip
            icon={<CalendarIcon />}
            label={new Date().toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
            color="primary"
            variant="outlined"
          />
        </Box>
      </Box>

      {/* Navigation Buttons */}
      <Paper sx={styles.navBar}>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            endIcon={<ArrowDropDownIcon />}
            onClick={(e) => setCurrentMenuAnchor(e.currentTarget)}
          >
            Current
          </Button>
          <Menu
            anchorEl={currentMenuAnchor}
            open={Boolean(currentMenuAnchor)}
            onClose={() => setCurrentMenuAnchor(null)}
          >
            <MenuItem onClick={() => navigate("/current/phd")}>PhD Scholars</MenuItem>
            <MenuItem onClick={() => navigate("/current/mtech")}>M.Tech Students</MenuItem>
          </Menu>

          <Button
            variant="outlined"
            endIcon={<ArrowDropDownIcon />}
            onClick={(e) => setGraduatedMenuAnchor(e.currentTarget)}
          >
            Graduated
          </Button>
          <Menu
            anchorEl={graduatedMenuAnchor}
            open={Boolean(graduatedMenuAnchor)}
            onClose={() => setGraduatedMenuAnchor(null)}
          >
            <MenuItem onClick={() => navigate("/graduated/phd")}>PhD Scholars</MenuItem>
            <MenuItem onClick={() => navigate("/graduated/mtech")}>M.Tech Students</MenuItem>
            <MenuItem onClick={() => navigate("/graduated/btech")}>B.Tech Students</MenuItem>
          </Menu>

          <Button
            variant="contained"
            endIcon={<ArrowDropDownIcon />}
            onClick={(e) => setCurrentMenuAnchor(e.currentTarget)}
          >
            Interns
          </Button>
        </Stack>
      </Paper>

      {/* Filter and Actions Bar */}
      <Paper sx={styles.actionBar}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search by name, university, domain, or degree..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
          <Grid item xs={12} md={6}>
            <Stack direction="row" spacing={2} justifyContent="flex-end" flexWrap="wrap">
              {searchQuery && (
                <Button variant="outlined" onClick={handleClearFilters} size="small">
                  Clear Filters
                </Button>
              )}
              <Button
                variant="outlined"
                startIcon={viewMode === "table" ? <ViewModuleIcon /> : <ViewListIcon />}
                onClick={() => setViewMode(viewMode === "table" ? "card" : "table")}
                size="small"
              >
                {viewMode === "table" ? "Card View" : "Table View"}
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog("add")}
                sx={styles.addButton}
              >
                Add Intern
              </Button>
              <Button variant="outlined" startIcon={<RefreshIcon />} onClick={fetchData}>
                Refresh
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs for filtering */}
      <Paper sx={{ mb: 3, p: 1 }}>
        <Stack direction="row" spacing={1} justifyContent="center">
          <Chip
            label="All Interns"
            onClick={() => setActiveTab("all")}
            color={activeTab === "all" ? "primary" : "default"}
            variant={activeTab === "all" ? "filled" : "outlined"}
          />
          <Chip
            label="Current Year"
            onClick={() => setActiveTab("currentYear")}
            color={activeTab === "currentYear" ? "primary" : "default"}
            variant={activeTab === "currentYear" ? "filled" : "outlined"}
          />
          <Chip
            label="Recent"
            onClick={() => setActiveTab("recent")}
            color={activeTab === "recent" ? "primary" : "default"}
            variant={activeTab === "recent" ? "filled" : "outlined"}
          />
        </Stack>
      </Paper>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={styles.statCard}>
            <Box sx={styles.statCardContent}>
              <PersonIcon sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
              <Typography variant="h4">{totalInterns}</Typography>
              <Typography variant="body2" color="text.secondary">
                Total Interns
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={styles.statCard}>
            <Box sx={styles.statCardContent}>
              <DomainIcon sx={{ fontSize: 40, color: "success.main", mb: 1 }} />
              <Typography variant="h4">{uniqueDomains.length}</Typography>
              <Typography variant="body2" color="text.secondary">
                Different Domains
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={styles.statCard}>
            <Box sx={styles.statCardContent}>
              <LocationCityIcon sx={{ fontSize: 40, color: "warning.main", mb: 1 }} />
              <Typography variant="h4">{uniqueUniversities.length}</Typography>
              <Typography variant="body2" color="text.secondary">
                Universities
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={styles.statCard}>
            <Box sx={styles.statCardContent}>
              <FilterIcon sx={{ fontSize: 40, color: "info.main", mb: 1 }} />
              <Typography variant="h4">{filteredData.length}</Typography>
              <Typography variant="body2" color="text.secondary">
                Filtered Results
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Interns Content - Table or Card View */}
      {loading ? (
        <Paper sx={styles.tablePaper}>
          <Box sx={styles.loadingContainer}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Loading interns...
            </Typography>
          </Box>
        </Paper>
      ) : filteredData.length === 0 ? (
        <Paper sx={styles.tablePaper}>
          <Box sx={styles.noDataContainer}>
            <WorkIcon sx={{ fontSize: 80, color: "text.disabled", mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              No interns found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {searchQuery
                ? "No interns match your search criteria"
                : "No interns available. Add your first intern!"}
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog("add")}
              sx={{ mt: 2 }}
            >
              ADD FIRST INTERN
            </Button>
          </Box>
        </Paper>
      ) : viewMode === "card" ? (
        // Card View
        <Grid container spacing={3}>
          {filteredData
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((intern) => (
              <Grid item xs={12} sm={6} md={4} key={intern._id}>
                <Card sx={styles.internCard}>
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                      <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56 }}>
                        <PersonIcon fontSize="large" />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight={600} noWrap>
                          {intern.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {intern.university_name}
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                          <Chip
                            label={`Batch: ${intern.graduating_year}`}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                          <Chip
                            label={intern.degree}
                            size="small"
                            variant="outlined"
                          />
                        </Stack>
                      </Box>
                    </Stack>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <strong>Domain:</strong> {intern.internship_domain}
                    </Typography>

                    <Grid container spacing={1} sx={{ mb: 1 }}>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Branch
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {intern.branch}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Duration
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {intern.duration}
                        </Typography>
                      </Grid>
                    </Grid>

                    {intern.info && (
                      <Typography variant="caption" color="text.secondary" sx={{ 
                        mt: 1,
                        display: 'block',
                        fontStyle: 'italic'
                      }}>
                        {intern.info}
                      </Typography>
                    )}
                  </CardContent>
                  <CardActions sx={{ justifyContent: "flex-end", px: 2, pb: 2 }}>
                    <Tooltip title="Edit">
                      <IconButton
                        onClick={() => handleOpenDialog("edit", intern)}
                        sx={{ color: "primary.main" }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        onClick={() => handleOpenDialog("delete", intern)}
                        sx={{ color: "error.main" }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: "flex", justifyContent: "center" }}>
              <TablePagination
                rowsPerPageOptions={[6, 12, 24]}
                component="div"
                count={filteredData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </Grid>
        </Grid>
      ) : (
        // Table View
        <TableContainer component={Paper} sx={styles.tablePaper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={styles.tableHeader}>Intern</TableCell>
                <TableCell sx={styles.tableHeader}>University & Degree</TableCell>
                <TableCell sx={styles.tableHeader}>Internship Details</TableCell>
                <TableCell sx={styles.tableHeader} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((intern) => (
                  <TableRow key={intern._id} hover>
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ bgcolor: "primary.main" }}>
                          <PersonIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="body1" fontWeight={500}>
                            {intern.name}
                          </Typography>
                          <Chip
                            label={`Batch ${intern.graduating_year}`}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ maxWidth: '200px' }}>
                      <Typography variant="body2" fontWeight={500}>
                        {intern.university_name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {intern.degree} - {intern.branch}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ maxWidth: '250px' }}>
                      <Stack spacing={0.5}>
                        <Typography variant="body2">
                          <strong>{intern.internship_domain}</strong>
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Duration: {intern.duration}
                        </Typography>
                        {intern.info && (
                          <Tooltip title={intern.info}>
                            <Typography variant="caption" color="text.secondary" sx={{
                              display: 'block',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              maxWidth: '200px'
                            }}>
                              {intern.info}
                            </Typography>
                          </Tooltip>
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Tooltip title="Edit">
                          <IconButton
                            onClick={() => handleOpenDialog("edit", intern)}
                            sx={{
                              color: "primary.main",
                              "&:hover": {
                                backgroundColor: "rgba(67, 97, 238, 0.1)",
                              },
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            onClick={() => handleOpenDialog("delete", intern)}
                            sx={{
                              color: "error.main",
                              "&:hover": {
                                backgroundColor: "rgba(239, 68, 68, 0.1)",
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
        </TableContainer>
      )}

      {/* Dialog for Add/Edit/Delete */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogMode === "add" && "Add New Intern"}
          {dialogMode === "edit" && "Edit Intern"}
          {dialogMode === "delete" && "Delete Intern"}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {dialogMode === "delete" ? (
              <Box>
                <Alert severity="warning" sx={{ mb: 2 }}>
                  Are you sure you want to delete this intern? This action cannot be undone.
                </Alert>
                {selectedIntern && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body1" gutterBottom>
                      <strong>Name:</strong> {selectedIntern.name}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>University:</strong> {selectedIntern.university_name}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Domain:</strong> {selectedIntern.internship_domain}
                    </Typography>
                  </Box>
                )}
              </Box>
            ) : (
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Intern Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter intern name..."
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Enrolled In"
                    name="enrolledIn"
                    value={formData.enrolledIn}
                    onChange={handleInputChange}
                    disabled
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SchoolIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Graduating Year"
                    name="graduating_year"
                    value={formData.graduating_year}
                    onChange={handleInputChange}
                    placeholder="YYYY"
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
                    label="University Name"
                    name="university_name"
                    value={formData.university_name}
                    onChange={handleInputChange}
                    placeholder="Enter university name..."
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationCityIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Degree"
                    name="degree"
                    value={formData.degree}
                    onChange={handleInputChange}
                    placeholder="e.g., B.Tech, B.Sc, MCA"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Branch"
                    name="branch"
                    value={formData.branch}
                    onChange={handleInputChange}
                    placeholder="e.g., Computer Science"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <DomainIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Internship Domain"
                    name="internship_domain"
                    value={formData.internship_domain}
                    onChange={handleInputChange}
                    placeholder="e.g., Web Development, Machine Learning"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <WorkIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="e.g., 3 months, 6 months"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <ScheduleIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Additional Information (Optional)"
                    name="info"
                    value={formData.info}
                    onChange={handleInputChange}
                    multiline
                    rows={2}
                    placeholder="Any additional notes about the internship..."
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
              color={dialogMode === "delete" ? "error" : "primary"}
            >
              {dialogMode === "add" && "Add Intern"}
              {dialogMode === "edit" && "Update Intern"}
              {dialogMode === "delete" && "Delete Intern"}
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
    backgroundColor: "background.default",
    minHeight: "100vh",
  },
  header: {
    mb: 3,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 2,
  },
  title: {
    fontWeight: 700,
    color: "primary.main",
  },
  navBar: {
    p: 2,
    mb: 3,
    backgroundColor: "background.paper",
    borderRadius: 2,
    boxShadow: 1,
  },
  actionBar: {
    p: 2,
    mb: 3,
    backgroundColor: "background.paper",
    borderRadius: 2,
    boxShadow: 1,
  },
  addButton: {
    backgroundColor: "primary.main",
    "&:hover": {
      backgroundColor: "primary.dark",
    },
  },
  statCard: {
    p: 3,
    borderRadius: 2,
    boxShadow: 1,
    transition: "transform 0.2s",
    "&:hover": {
      transform: "translateY(-2px)",
    },
  },
  statCardContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  tablePaper: {
    borderRadius: 2,
    boxShadow: 1,
    overflow: "hidden",
    minHeight: "400px",
  },
  tableHeader: {
    fontWeight: 600,
    backgroundColor: "grey.100",
    fontSize: "0.875rem",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    py: 10,
  },
  noDataContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    py: 8,
    textAlign: "center",
  },
  internCard: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.2s, box-shadow 0.2s",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: 4,
    },
  },
};

export default Interns;