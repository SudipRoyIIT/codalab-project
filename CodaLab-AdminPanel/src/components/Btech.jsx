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
  Autocomplete,
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
  Groups as GroupsIcon,
  Business as BusinessIcon,
} from "@mui/icons-material";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3001";

const BtechGraduated = () => {
  // Navigation
  const navigate = useNavigate();

  // States
  const [loading, setLoading] = useState(false);
  const [studentsData, setStudentsData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [viewMode, setViewMode] = useState("table");

  // Menu states
  const [currentMenuAnchor, setCurrentMenuAnchor] = useState(null);
  const [graduatedMenuAnchor, setGraduatedMenuAnchor] = useState(null);

  // Form state (B.Tech supports multiple names)
  const [formData, setFormData] = useState({
    names: [""],
    enrolledIn: "B.Tech",
    graduating_year: "",
    branch: "",
    thesis_title: "",
    current_working_status: "",
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Fetch all graduated B.Tech students
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
        const btechData = data.filter((student) => student.enrolledIn === "B.Tech");
        setStudentsData(btechData);
        
        if (btechData.length === 0) {
          toast.info("No B.Tech graduates found");
        } else {
          toast.success(`Loaded ${btechData.length} B.Tech graduate${btechData.length > 1 ? 's' : ''}`);
        }
      } else {
        const errorText = await response.text();
        toast.error(`Failed to load data: ${response.status} ${errorText}`);
        setStudentsData([]);
      }
    } catch (error) {
      console.error("Network error:", error);
      toast.error("Cannot connect to backend server");
      setStudentsData([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle multiple names
  const handleNameChange = (index, value) => {
    const newNames = [...formData.names];
    newNames[index] = value;
    setFormData(prev => ({ ...prev, names: newNames }));
  };

  const addNameField = () => {
    setFormData(prev => ({ ...prev, names: [...prev.names, ""] }));
  };

  const removeNameField = (index) => {
    if (formData.names.length > 1) {
      const newNames = formData.names.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, names: newNames }));
    }
  };

  // Open dialog for add/edit/delete
  const handleOpenDialog = (mode, student = null) => {
    setDialogMode(mode);
    setSelectedStudent(student);

    if (mode === "edit" && student) {
      // Handle both string and array name formats
      const studentNames = Array.isArray(student.name) 
        ? student.name 
        : [student.name || ""];
      
      setFormData({
        names: studentNames,
        enrolledIn: student.enrolledIn || "B.Tech",
        graduating_year: student.graduating_year || "",
        branch: student.branch || "",
        thesis_title: student.thesis_title || "",
        current_working_status: student.current_working_status || "",
      });
    } else if (mode === "add") {
      setFormData({
        names: [""],
        enrolledIn: "B.Tech",
        graduating_year: "",
        branch: "",
        thesis_title: "",
        current_working_status: "",
      });
    }

    setDialogOpen(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setFormData({
      names: [""],
      enrolledIn: "B.Tech",
      graduating_year: "",
      branch: "",
      thesis_title: "",
      current_working_status: "",
    });
    setSelectedStudent(null);
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

      // Filter out empty names
      const filteredNames = formData.names.filter(name => name.trim() !== "");

      if (dialogMode === "add") {
        const requiredFields = ["graduating_year", "branch", "current_working_status"];
        const missingFields = requiredFields.filter((field) => !formData[field]);

        if (filteredNames.length === 0) {
          toast.error("Please enter at least one student name");
          return;
        }

        if (missingFields.length > 0) {
          toast.error(`Please fill in: ${missingFields.join(", ")}`);
          return;
        }

        endpoint = `${BASE_URL}/api/${afApi}/private/createNewStudent`;
        method = "POST";
        payload = {
          name: filteredNames,
          enrolledIn: formData.enrolledIn,
          graduating_year: formData.graduating_year,
          branch: formData.branch,
          thesis_title: formData.thesis_title,
          current_working_status: formData.current_working_status,
        };
      } else if (dialogMode === "edit" && selectedStudent) {
        const requiredFields = ["graduating_year", "branch", "current_working_status"];
        const missingFields = requiredFields.filter((field) => !formData[field]);

        if (filteredNames.length === 0) {
          toast.error("Please enter at least one student name");
          return;
        }

        if (missingFields.length > 0) {
          toast.error(`Please fill in: ${missingFields.join(", ")}`);
          return;
        }

        endpoint = `${BASE_URL}/api/${afApi}/private/updateNewStudent/${selectedStudent._id}`;
        method = "PUT";
        payload = {
          name: filteredNames,
          enrolledIn: formData.enrolledIn,
          graduating_year: formData.graduating_year,
          branch: formData.branch,
          thesis_title: formData.thesis_title,
          current_working_status: formData.current_working_status,
        };
      } else if (dialogMode === "delete" && selectedStudent) {
        endpoint = `${BASE_URL}/api/${afApi}/private/deleteNewStudent/${selectedStudent._id}`;
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
        toast.success(`Student(s) ${action} successfully!`);
        handleCloseDialog();
        fetchData();
      } else {
        const errorText = await response.text();
        try {
          const errorJson = JSON.parse(errorText);
          toast.error(errorJson.message || `Failed to ${dialogMode} student(s)`);
        } catch {
          toast.error(`Failed to ${dialogMode} student(s): ${errorText}`);
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

  // Filter students by search
  const filteredData = studentsData.filter((student) => {
    // Handle both string and array name formats
    const studentNames = Array.isArray(student.name) 
      ? student.name.join(" ") 
      : student.name || "";
    
    const branch = student.branch || "";
    const thesis = student.thesis_title || "";
    const workplace = student.current_working_status || "";

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !studentNames.toLowerCase().includes(query) &&
        !branch.toLowerCase().includes(query) &&
        !thesis.toLowerCase().includes(query) &&
        !workplace.toLowerCase().includes(query)
      ) {
        return false;
      }
    }

    return true;
  });

  // Statistics
  const totalStudents = studentsData.length;
  
  // Count unique branches
  const uniqueBranches = [...new Set(studentsData.map(s => s.branch))].filter(Boolean);
  
  // Count students with thesis
  const studentsWithThesis = studentsData.filter(s => 
    s.thesis_title && s.thesis_title.trim() !== ""
  ).length;

  // Recent graduates (last 5 years)
  const currentYear = new Date().getFullYear();
  const recentGraduates = studentsData.filter(s => {
    const gradYear = parseInt(s.graduating_year);
    return gradYear >= currentYear - 5;
  }).length;

  // Format names for display
  const formatNames = (student) => {
    if (Array.isArray(student.name)) {
      return student.name.join(", ");
    }
    return student.name || "Unknown";
  };

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
            {filteredData.length} B.Tech graduate(s) found
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
            variant="contained"
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

          <Button variant="outlined" onClick={() => navigate("/interns")}>
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
              placeholder="Search by names, branch, thesis, or workplace..."
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
                Add Graduate(s)
              </Button>
              <Button variant="outlined" startIcon={<RefreshIcon />} onClick={fetchData}>
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
              <GroupsIcon sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
              <Typography variant="h4">{totalStudents}</Typography>
              <Typography variant="body2" color="text.secondary">
                Total B.Tech Graduates
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={styles.statCard}>
            <Box sx={styles.statCardContent}>
              <DomainIcon sx={{ fontSize: 40, color: "success.main", mb: 1 }} />
              <Typography variant="h4">{uniqueBranches.length}</Typography>
              <Typography variant="body2" color="text.secondary">
                Different Branches
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={styles.statCard}>
            <Box sx={styles.statCardContent}>
              <SchoolIcon sx={{ fontSize: 40, color: "warning.main", mb: 1 }} />
              <Typography variant="h4">{studentsWithThesis}</Typography>
              <Typography variant="body2" color="text.secondary">
                With Thesis
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

      {/* Students Content - Table or Card View */}
      {loading ? (
        <Paper sx={styles.tablePaper}>
          <Box sx={styles.loadingContainer}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Loading B.Tech graduates...
            </Typography>
          </Box>
        </Paper>
      ) : filteredData.length === 0 ? (
        <Paper sx={styles.tablePaper}>
          <Box sx={styles.noDataContainer}>
            <SchoolIcon sx={{ fontSize: 80, color: "text.disabled", mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              No graduates found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {searchQuery
                ? "No graduates match your search criteria"
                : "No B.Tech graduates available. Add your first graduate(s)!"}
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog("add")}
              sx={{ mt: 2 }}
            >
              ADD FIRST GRADUATE(S)
            </Button>
          </Box>
        </Paper>
      ) : viewMode === "card" ? (
        // Card View
        <Grid container spacing={3}>
          {filteredData
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((student) => (
              <Grid item xs={12} sm={6} md={4} key={student._id}>
                <Card sx={styles.studentCard}>
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                      <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56 }}>
                        <GroupsIcon fontSize="large" />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight={600}>
                          {formatNames(student).length > 40 
                            ? `${formatNames(student).substring(0, 40)}...` 
                            : formatNames(student)}
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                          <Chip
                            label={`${student.graduating_year}`}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                          {student.branch && (
                            <Chip
                              label={student.branch}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Stack>
                      </Box>
                    </Stack>

                    {student.thesis_title && (
                      <>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          <strong>Thesis:</strong>
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          mb: 1, 
                          fontSize: '0.875rem',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {student.thesis_title}
                        </Typography>
                      </>
                    )}

                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1, mt: 2 }}>
                      <BusinessIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {student.current_working_status}
                      </Typography>
                    </Stack>

                    <Typography variant="caption" color="text.secondary" sx={{ 
                      mt: 1,
                      display: 'block',
                      fontStyle: 'italic'
                    }}>
                      B.Tech Graduates
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: "flex-end", px: 2, pb: 2 }}>
                    <Tooltip title="Edit">
                      <IconButton
                        onClick={() => handleOpenDialog("edit", student)}
                        sx={{ color: "primary.main" }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        onClick={() => handleOpenDialog("delete", student)}
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
                <TableCell sx={styles.tableHeader}>Students</TableCell>
                <TableCell sx={styles.tableHeader}>Branch</TableCell>
                <TableCell sx={styles.tableHeader}>Thesis Title</TableCell>
                <TableCell sx={styles.tableHeader}>Current Position</TableCell>
                <TableCell sx={styles.tableHeader} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((student) => (
                  <TableRow key={student._id} hover>
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ bgcolor: "primary.main" }}>
                          <GroupsIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="body1" fontWeight={500}>
                            {formatNames(student).length > 40 
                              ? `${formatNames(student).substring(0, 40)}...` 
                              : formatNames(student)}
                          </Typography>
                          <Chip
                            label={`Graduated ${student.graduating_year}`}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={student.branch || "Not specified"}
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell sx={{ maxWidth: '250px' }}>
                      {student.thesis_title ? (
                        <Tooltip title={student.thesis_title}>
                          <Typography variant="body2" sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {student.thesis_title}
                          </Typography>
                        </Tooltip>
                      ) : (
                        <Typography variant="caption" color="text.secondary" fontStyle="italic">
                          No thesis
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell sx={{ maxWidth: '200px' }}>
                      <Typography variant="body2" fontWeight={500}>
                        {student.current_working_status}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Tooltip title="Edit">
                          <IconButton
                            onClick={() => handleOpenDialog("edit", student)}
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
                            onClick={() => handleOpenDialog("delete", student)}
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
          {dialogMode === "add" && "Add B.Tech Graduate(s)"}
          {dialogMode === "edit" && "Edit B.Tech Graduate(s)"}
          {dialogMode === "delete" && "Delete B.Tech Graduate(s)"}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {dialogMode === "delete" ? (
              <Box>
                <Alert severity="warning" sx={{ mb: 2 }}>
                  Are you sure you want to delete this graduate entry? This action cannot be undone.
                </Alert>
                {selectedStudent && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body1" gutterBottom>
                      <strong>Students:</strong> {formatNames(selectedStudent)}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Branch:</strong> {selectedStudent.branch}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Graduating Year:</strong> {selectedStudent.graduating_year}
                    </Typography>
                  </Box>
                )}
              </Box>
            ) : (
              <Grid container spacing={2}>
                {/* Multiple Names Input */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Student Names (Add multiple if group project)
                  </Typography>
                  {formData.names.map((name, index) => (
                    <Box key={index} sx={{ display: 'flex', gap: 2, mb: 1, alignItems: 'center' }}>
                      <TextField
                        fullWidth
                        label={`Student ${index + 1}`}
                        value={name}
                        onChange={(e) => handleNameChange(index, e.target.value)}
                        size="small"
                        placeholder="Enter student name"
                      />
                      {formData.names.length > 1 && (
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => removeNameField(index)}
                          size="small"
                        >
                          Remove
                        </Button>
                      )}
                    </Box>
                  ))}
                  <Button
                    variant="outlined"
                    onClick={addNameField}
                    startIcon={<AddIcon />}
                    sx={{ mt: 1 }}
                  >
                    Add Another Student
                  </Button>
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
                    type="number"
                    label="Graduating Year"
                    name="graduating_year"
                    value={formData.graduating_year}
                    onChange={handleInputChange}
                    placeholder="YYYY"
                    inputProps={{
                      min: 1900,
                      max: new Date().getFullYear(),
                    }}
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
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Thesis Title (Optional)"
                    name="thesis_title"
                    value={formData.thesis_title}
                    onChange={handleInputChange}
                    multiline
                    rows={2}
                    placeholder="Enter thesis title (if applicable)..."
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    label="Current Working Status"
                    name="current_working_status"
                    value={formData.current_working_status}
                    onChange={handleInputChange}
                    placeholder="e.g., Software Engineer at Google"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BusinessIcon />
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
              color={dialogMode === "delete" ? "error" : "primary"}
            >
              {dialogMode === "add" && "Add Graduate(s)"}
              {dialogMode === "edit" && "Update Graduate(s)"}
              {dialogMode === "delete" && "Delete Graduate(s)"}
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
  studentCard: {
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

export default BtechGraduated;