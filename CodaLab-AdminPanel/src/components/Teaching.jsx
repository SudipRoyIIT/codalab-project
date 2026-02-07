// Teachings.jsx - Complete redesign based on Research page
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
  Collapse,
  MenuItem,
  Divider,
  Alert,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  School as SchoolIcon,
  Refresh as RefreshIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  CalendarToday as CalendarIcon,
  Class as ClassIcon,
  MenuBook as BookIcon,
  Group as GroupIcon,
  Remove as RemoveIcon,
} from "@mui/icons-material";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3001";

const Teachings = () => {
  const userRole = localStorage.getItem("userInfo");
  const afApi = userRole === "admin" ? "Admin" : "Subadmin";

  // States
  const [loading, setLoading] = useState(false);
  const [teachings, setTeachings] = useState([]);
  const [allTeachings, setAllTeachings] = useState([]);
  const [searchYear, setSearchYear] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("");
  const [selectedTeaching, setSelectedTeaching] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});

  // Form state
  const [formData, setFormData] = useState({
    year: "",
    semester: "",
    courses: [
      {
        subjectCode: "",
        subjectName: "",
        studentsStrength: "",
        additionalInfo: "",
      },
    ],
  });

  // Load all teachings on mount
  useEffect(() => {
    loadAllTeachings();
  }, []);

  // Load ALL teachings
  const loadAllTeachings = async () => {
    setLoading(true);
    try {
      console.log("📡 Loading all teachings...");

      // Search with multiple years to get all data
      const currentYear = new Date().getFullYear();
      const searchYears = [];
      for (let i = currentYear - 10; i <= currentYear + 2; i++) {
        searchYears.push(`${i}-${i + 1}`);
        searchYears.push(i.toString());
      }

      const allResults = new Map();

      for (const year of searchYears) {
        try {
          const endpoint = `${BASE_URL}/api/${afApi}/private/getSemester/${encodeURIComponent(year)}`;

          const response = await fetch(endpoint, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authorization: "Bearer " + localStorage.getItem("accessToken"),
            },
          });

          if (response.ok) {
            const data = await response.json();

            // Process Spring Semester
            if (data.DataForSpringSemesterCollection) {
              data.DataForSpringSemesterCollection.forEach(item => {
                if (item._id) {
                  allResults.set(item._id, { ...item, semester: "Spring Semester" });
                }
              });
            }

            // Process Autumn Semester
            if (data.DataForautumnSemesterCollection) {
              data.DataForautumnSemesterCollection.forEach(item => {
                if (item._id) {
                  allResults.set(item._id, { ...item, semester: "Autumn Semester" });
                }
              });
            }
          }
        } catch (error) {
          console.error(`Error searching with year "${year}":`, error);
        }
      }

      const combinedResults = Array.from(allResults.values());

      console.log(`✅ Loaded ${combinedResults.length} unique teaching records`);

      setAllTeachings(combinedResults);
      setTeachings(combinedResults);

      if (combinedResults.length > 0) {
        toast.success(`Loaded ${combinedResults.length} teaching records`);
      }
    } catch (error) {
      console.error("💥 Error loading teachings:", error);
      toast.error("Failed to load teachings");
    } finally {
      setLoading(false);
    }
  };

  // Toggle row expansion
  const handleExpandRow = (id) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Search teachings
  const searchTeachings = (year) => {
    if (!year || year.trim() === "") {
      setTeachings(allTeachings);
      return;
    }

    const searchTerm = year.toLowerCase();
    const filtered = allTeachings.filter(item =>
      item.year.toLowerCase().includes(searchTerm) ||
      item.semester.toLowerCase().includes(searchTerm)
    );

    setTeachings(filtered);
    setPage(0);

    if (filtered.length === 0) {
      toast.info(`No teachings found for "${year}"`);
    } else {
      toast.success(`Found ${filtered.length} teaching record(s)`);
    }
  };

  const handleSearch = () => {
    searchTeachings(searchYear);
  };

  const handleClearSearch = () => {
    setSearchYear("");
    setTeachings(allTeachings);
    setPage(0);
  };

  const handleRefresh = () => {
    setSearchYear("");
    setExpandedRows({});
    loadAllTeachings();
  };

  // Form handlers
  const handleInputChange = (e, index = null) => {
    const { name, value } = e.target;

    if (name === "year" || name === "semester") {
      setFormData(prev => ({ ...prev, [name]: value }));
    } else {
      const updatedValue = name === "studentsStrength" ? parseInt(value, 10) || "" : value;
      const updatedCourses = formData.courses.map((course, i) =>
        i === index ? { ...course, [name]: updatedValue } : course
      );
      setFormData(prev => ({ ...prev, courses: updatedCourses }));
    }
  };

  const addCourseField = () => {
    setFormData(prev => ({
      ...prev,
      courses: [
        ...prev.courses,
        {
          subjectCode: "",
          subjectName: "",
          studentsStrength: "",
          additionalInfo: "",
        },
      ],
    }));
  };

  const removeCourseField = (index) => {
    if (formData.courses.length > 1) {
      const updatedCourses = formData.courses.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, courses: updatedCourses }));
    }
  };

  // Dialog handlers
  const handleOpenDialog = (mode, teaching = null) => {
    setDialogMode(mode);
    setSelectedTeaching(teaching);

    if (mode === 'edit' && teaching) {
      setFormData({
        year: teaching.year || "",
        semester: teaching.semester === "Spring Semester" ? "springSemester" : "autumnSemester",
        courses: teaching.courses || [
          {
            subjectCode: "",
            subjectName: "",
            studentsStrength: "",
            additionalInfo: "",
          },
        ],
      });
    } else if (mode === 'add') {
      setFormData({
        year: "",
        semester: "",
        courses: [
          {
            subjectCode: "",
            subjectName: "",
            studentsStrength: "",
            additionalInfo: "",
          },
        ],
      });
    }

    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setFormData({
      year: "",
      semester: "",
      courses: [
        {
          subjectCode: "",
          subjectName: "",
          studentsStrength: "",
          additionalInfo: "",
        },
      ],
    });
    setSelectedTeaching(null);
  };

  // Validate year format
  const validateYear = (year) => {
    const yearPattern = /^\d{4}-\d{4}$/;
    if (!yearPattern.test(year)) {
      return "Please enter the year in the format YYYY-YYYY (e.g., 2023-2024)";
    }
    const [startYear, endYear] = year.split("-").map(Number);
    if (startYear >= endYear) {
      return "End year should be greater than start year";
    }
    return null;
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (dialogMode !== 'delete') {
      // Validate year
      const yearError = validateYear(formData.year);
      if (yearError) {
        toast.error(yearError);
        return;
      }

      // Validate required fields
      if (!formData.semester) {
        toast.error("Please select a semester");
        return;
      }

      // Validate courses
      for (let i = 0; i < formData.courses.length; i++) {
        const course = formData.courses[i];
        if (!course.subjectCode || !course.subjectName || !course.studentsStrength) {
          toast.error(`Please fill all required fields in Course ${i + 1}`);
          return;
        }
      }
    }

    setLoading(true);
    try {
      let endpoint = '';
      let method = '';
      const sem = formData.semester.split(" ")[0];

      if (dialogMode === 'add') {
        endpoint = `${BASE_URL}/api/${afApi}/private/createSemester/${sem}`;
        method = 'POST';
      } else if (dialogMode === 'edit' && selectedTeaching) {
        endpoint = `${BASE_URL}/api/${afApi}/private/UpdateSelectedSemester/${selectedTeaching._id}/${sem}`;
        method = 'PUT';
      } else if (dialogMode === 'delete' && selectedTeaching) {
        endpoint = `${BASE_URL}/api/${afApi}/private/deleteSelectedSemester/${selectedTeaching._id}`;
        method = 'DELETE';
      }

      console.log(`Making ${method} request to:`, endpoint);

      const response = await fetch(endpoint, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
        body: method !== 'DELETE' ? JSON.stringify(formData) : undefined,
      });

      if (response.ok) {
        const action = dialogMode === 'add' ? 'added' :
          dialogMode === 'edit' ? 'updated' : 'deleted';
        toast.success(`Teaching record ${action} successfully!`);
        handleCloseDialog();

        await loadAllTeachings();

        if (searchYear.trim()) {
          setSearchYear("");
        }
      } else {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        toast.error(`Failed to ${dialogMode} teaching record`);
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(`Network error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Statistics
  const springCount = allTeachings.filter(t => t.semester === "Spring Semester").length;
  const autumnCount = allTeachings.filter(t => t.semester === "Autumn Semester").length;
  const totalCourses = allTeachings.reduce((sum, t) => sum + (t.courses?.length || 0), 0);

  return (
    <Box sx={styles.container}>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <Box sx={styles.header}>
        <Box>
          <Typography variant="h4" sx={styles.title}>
            <SchoolIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Teachings Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total: {allTeachings.length} records | Spring: {springCount} | Autumn: {autumnCount} | Courses: {totalCourses}
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog('add')}
            sx={styles.addButton}
          >
            Add New Semester
          </Button>
          <Tooltip title="Refresh data">
            <IconButton onClick={handleRefresh} color="primary" size="large">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={styles.statCard}>
            <Box sx={styles.statCardContent}>
              <SchoolIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4">{allTeachings.length}</Typography>
              <Typography variant="body2" color="text.secondary">
                Total Records
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={styles.statCard}>
            <Box sx={styles.statCardContent}>
              <ClassIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4">{springCount}</Typography>
              <Typography variant="body2" color="text.secondary">
                Spring Semesters
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={styles.statCard}>
            <Box sx={styles.statCardContent}>
              <BookIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h4">{autumnCount}</Typography>
              <Typography variant="body2" color="text.secondary">
                Autumn Semesters
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={styles.statCard}>
            <Box sx={styles.statCardContent}>
              <GroupIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4">{totalCourses}</Typography>
              <Typography variant="body2" color="text.secondary">
                Total Courses
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Search Bar */}
      <Paper sx={styles.searchBar}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={9}>
            <TextField
              fullWidth
              placeholder="Search by year (e.g., 2023-2024) or semester..."
              value={searchYear}
              onChange={(e) => {
                setSearchYear(e.target.value);
                if (e.target.value.trim() === "") {
                  handleClearSearch();
                }
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchYear && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={handleClearSearch}>
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleSearch}
              startIcon={<SearchIcon />}
              disabled={!searchYear.trim()}
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Teachings Table */}
      <TableContainer component={Paper} sx={styles.tablePaper}>
        {loading ? (
          <Box sx={styles.loadingContainer}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Loading teachings...
            </Typography>
          </Box>
        ) : teachings.length === 0 ? (
          <Box sx={styles.noDataContainer}>
            <SchoolIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              No Teaching Records Found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {searchYear
                ? `No results for "${searchYear}"`
                : "Start by adding your first semester"
              }
            </Typography>
            <Stack direction="row" spacing={2}>
              {searchYear && (
                <Button
                  variant="outlined"
                  startIcon={<ClearIcon />}
                  onClick={handleClearSearch}
                >
                  Clear Search
                </Button>
              )}
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog('add')}
              >
                Add Semester
              </Button>
            </Stack>
          </Box>
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={styles.tableHeader} width="50">#</TableCell>
                  <TableCell sx={styles.tableHeader}>Year</TableCell>
                  <TableCell sx={styles.tableHeader} width="150">Semester</TableCell>
                  <TableCell sx={styles.tableHeader} width="100">Courses</TableCell>
                  <TableCell sx={styles.tableHeader} width="150" align="center">Actions</TableCell>
                  <TableCell sx={styles.tableHeader} width="80" align="center">Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {teachings
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item, index) => {
                    const isExpanded = expandedRows[item._id];
                    const coursesCount = item.courses?.length || 0;

                    return (
                      <React.Fragment key={item._id}>
                        <TableRow hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight={600}>
                              {page * rowsPerPage + index + 1}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body1" fontWeight={600} sx={{ color: '#1a237e' }}>
                              {item.year}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={item.semester}
                              size="small"
                              color={item.semester === "Spring Semester" ? "success" : "info"}
                              icon={item.semester === "Spring Semester" ? <ClassIcon /> : <BookIcon />}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={`${coursesCount} course${coursesCount !== 1 ? 's' : ''}`}
                              size="small"
                              variant="outlined"
                              color="primary"
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Stack direction="row" spacing={1} justifyContent="center">
                              <Tooltip title="Edit">
                                <IconButton
                                  onClick={() => handleOpenDialog('edit', item)}
                                  size="small"
                                  sx={{ color: 'primary.main' }}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton
                                  onClick={() => handleOpenDialog('delete', item)}
                                  size="small"
                                  sx={{ color: 'error.main' }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              size="small"
                              onClick={() => handleExpandRow(item._id)}
                            >
                              {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            </IconButton>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={6} sx={{ p: 0, borderBottom: isExpanded ? '1px solid rgba(224, 224, 224, 1)' : 'none' }}>
                            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                              <Box sx={{ p: 3, bgcolor: '#f5f5f5' }}>
                                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                  📚 Courses for {item.semester} {item.year}:
                                </Typography>
                                <List dense>
                                  {item.courses && item.courses.map((course, idx) => (
                                    <ListItem key={idx} sx={{ pl: 0, flexDirection: 'column', alignItems: 'flex-start' }}>
                                      <ListItemText
                                        primary={
                                          <Typography variant="body1" fontWeight={600}>
                                            {idx + 1}. {course.subjectName}
                                          </Typography>
                                        }
                                        secondary={
                                          <Box>
                                            <Typography variant="body2" color="text.secondary">
                                              <strong>Code:</strong> {course.subjectCode}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                              <strong>Students:</strong> {course.studentsStrength}
                                            </Typography>
                                            {course.additionalInfo && (
                                              <Typography variant="body2" color="text.secondary">
                                                <strong>Info:</strong> {course.additionalInfo}
                                              </Typography>
                                            )}
                                          </Box>
                                        }
                                      />
                                      {idx < item.courses.length - 1 && <Divider sx={{ width: '100%', mt: 1 }} />}
                                    </ListItem>
                                  ))}
                                </List>
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    );
                  })}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={teachings.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </TableContainer>

      {/* Add/Edit/Delete Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogMode === 'add' && 'Add New Semester'}
          {dialogMode === 'edit' && 'Edit Semester'}
          {dialogMode === 'delete' && 'Delete Semester'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ mt: 2 }}>
            {dialogMode === 'delete' ? (
              <Box>
                <Alert severity="warning" sx={{ mb: 2 }}>
                  Are you sure you want to delete this semester? This action cannot be undone.
                </Alert>
                {selectedTeaching && (
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                    <Typography variant="body1" gutterBottom>
                      <strong>Year:</strong> {selectedTeaching.year}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Semester:</strong> {selectedTeaching.semester}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Courses:</strong> {selectedTeaching.courses?.length || 0}
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
                    label="Academic Year"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    placeholder="YYYY-YYYY (e.g., 2023-2024)"
                    helperText="Format: YYYY-YYYY"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    select
                    label="Semester"
                    name="semester"
                    value={formData.semester}
                    onChange={handleInputChange}
                    disabled={dialogMode === 'edit'}
                  >
                    <MenuItem value="springSemester">Spring Semester</MenuItem>
                    <MenuItem value="autumnSemester">Autumn Semester</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Courses
                  </Typography>
                </Grid>

                {formData.courses.map((course, index) => (
                  <React.Fragment key={index}>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          Course {index + 1}
                        </Typography>
                        {formData.courses.length > 1 && (
                          <IconButton
                            onClick={() => removeCourseField(index)}
                            color="error"
                            size="small"
                          >
                            <RemoveIcon />
                          </IconButton>
                        )}
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        required
                        label="Subject Name"
                        name="subjectName"
                        value={course.subjectName}
                        onChange={(e) => handleInputChange(e, index)}
                        placeholder="e.g., Data Structures"
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        required
                        label="Subject Code"
                        name="subjectCode"
                        value={course.subjectCode}
                        onChange={(e) => handleInputChange(e, index)}
                        placeholder="e.g., CS101"
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        required
                        label="Students Strength"
                        name="studentsStrength"
                        type="number"
                        value={course.studentsStrength}
                        onChange={(e) => handleInputChange(e, index)}
                        placeholder="Number of students"
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Additional Info"
                        name="additionalInfo"
                        value={course.additionalInfo}
                        onChange={(e) => handleInputChange(e, index)}
                        placeholder="Any additional details"
                      />
                    </Grid>

                    {index < formData.courses.length - 1 && (
                      <Grid item xs={12}>
                        <Divider />
                      </Grid>
                    )}
                  </React.Fragment>
                ))}

                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={addCourseField}
                    fullWidth
                  >
                    Add Another Course
                  </Button>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={handleCloseDialog} variant="outlined">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color={dialogMode === 'delete' ? 'error' : 'primary'}
              disabled={loading}
            >
              {dialogMode === 'add' && 'Add Semester'}
              {dialogMode === 'edit' && 'Update Semester'}
              {dialogMode === 'delete' && 'Delete Semester'}
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
    mb: 3,
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
  searchBar: {
    p: 2.5,
    mb: 3,
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
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: 'var(--shadow-md)',
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

export default Teachings;