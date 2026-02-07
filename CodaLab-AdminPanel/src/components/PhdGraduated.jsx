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
  Article as ArticleIcon,
  Description as DescriptionIcon,
  ArrowDropDown as ArrowDropDownIcon,
  FilterList as FilterIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
} from "@mui/icons-material";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3001";

const PhdGraduated = () => {
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

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    enrolledIn: "PhD Scholar",
    graduating_year: "",
    thesis_title: "",
    no_of_journal_papers: "",
    no_of_conference_papers: "",
    current_working_status: "",
    place_of_work: "",
    info: "",
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Fetch all graduated PhD students
  const fetchData = async () => {
    setLoading(true);
    try {
      const url = `${BASE_URL}/api/Admin/private/getGraduatedStudents?name=${searchQuery}&_=${Date.now()}`;
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
        const phdData = data.filter((student) => student.enrolledIn === "PhD Scholar");
        setStudentsData(phdData);
        if (phdData.length === 0) {
          toast.info("No PhD scholars found");
        } else {
          toast.success(`Loaded ${phdData.length} PhD scholar${phdData.length > 1 ? 's' : ''}`);
        }
      } else {
        toast.error(`Failed to load data: ${response.status}`);
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

  // Handle form input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Open dialog for add/edit/delete
  const handleOpenDialog = (mode, student = null) => {
    setDialogMode(mode);
    setSelectedStudent(student);

    if (mode === "edit" && student) {
      setFormData({
        name: student.name || "",
        enrolledIn: student.enrolledIn || "PhD Scholar",
        graduating_year: student.graduating_year || "",
        thesis_title: student.thesis_title || "",
        no_of_journal_papers: student.no_of_journal_papers || "",
        no_of_conference_papers: student.no_of_conference_papers || "",
        current_working_status: student.current_working_status || "",
        place_of_work: student.place_of_work || "",
        info: student.info || "",
      });
    } else if (mode === "add") {
      setFormData({
        name: "",
        enrolledIn: "PhD Scholar",
        graduating_year: "",
        thesis_title: "",
        no_of_journal_papers: "",
        no_of_conference_papers: "",
        current_working_status: "",
        place_of_work: "",
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
      enrolledIn: "PhD Scholar",
      graduating_year: "",
      thesis_title: "",
      no_of_journal_papers: "",
      no_of_conference_papers: "",
      current_working_status: "",
      place_of_work: "",
      info: "",
    });
    setSelectedStudent(null);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let endpoint = "";
      let method = "";
      let payload = null;

      if (dialogMode === "add") {
        const requiredFields = [
          "name",
          "enrolledIn",
          "graduating_year",
          "thesis_title",
          "no_of_journal_papers",
          "no_of_conference_papers",
          "current_working_status",
          "place_of_work",
        ];
        const missingFields = requiredFields.filter((field) => !formData[field]);

        if (missingFields.length > 0) {
          toast.error(`Please fill in: ${missingFields.join(", ")}`);
          return;
        }

        endpoint = `${BASE_URL}/api/Admin/private/createNewStudent`;
        method = "POST";
        payload = formData;
      } else if (dialogMode === "edit" && selectedStudent) {
        const requiredFields = [
          "name",
          "enrolledIn",
          "graduating_year",
          "thesis_title",
          "no_of_journal_papers",
          "no_of_conference_papers",
          "current_working_status",
          "place_of_work",
        ];
        const missingFields = requiredFields.filter((field) => !formData[field]);

        if (missingFields.length > 0) {
          toast.error(`Please fill in: ${missingFields.join(", ")}`);
          return;
        }

        endpoint = `${BASE_URL}/api/Admin/private/updateNewStudent/${selectedStudent._id}`;
        method = "PUT";
        payload = formData;
      } else if (dialogMode === "delete" && selectedStudent) {
        endpoint = `${BASE_URL}/api/Admin/private/deleteNewStudent/${selectedStudent._id}`;
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
        const action =
          dialogMode === "add" ? "added" : dialogMode === "edit" ? "updated" : "deleted";
        toast.success(`Student ${action} successfully!`);
        handleCloseDialog();
        fetchData();
      } else {
        const errorText = await response.text();
        try {
          const errorJson = JSON.parse(errorText);
          toast.error(errorJson.message || `Failed to ${dialogMode} student`);
        } catch {
          toast.error(`Failed to ${dialogMode} student`);
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
    const name = student.name || "";
    const thesis = student.thesis_title || "";
    const workplace = student.place_of_work || "";

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !name.toLowerCase().includes(query) &&
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
  const avgJournalPapers =
    studentsData.length > 0
      ? (
          studentsData.reduce(
            (sum, s) => sum + (parseInt(s.no_of_journal_papers) || 0),
            0
          ) / studentsData.length
        ).toFixed(1)
      : 0;
  const avgConferencePapers =
    studentsData.length > 0
      ? (
          studentsData.reduce(
            (sum, s) => sum + (parseInt(s.no_of_conference_papers) || 0),
            0
          ) / studentsData.length
        ).toFixed(1)
      : 0;

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
            {filteredData.length} PhD scholar(s) found
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
              placeholder="Search by name, thesis, or workplace..."
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
                Add Student
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
              <SchoolIcon sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
              <Typography variant="h4">{totalStudents}</Typography>
              <Typography variant="body2" color="text.secondary">
                Total PhD Scholars
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={styles.statCard}>
            <Box sx={styles.statCardContent}>
              <ArticleIcon sx={{ fontSize: 40, color: "success.main", mb: 1 }} />
              <Typography variant="h4">{avgJournalPapers}</Typography>
              <Typography variant="body2" color="text.secondary">
                Avg Journal Papers
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={styles.statCard}>
            <Box sx={styles.statCardContent}>
              <DescriptionIcon sx={{ fontSize: 40, color: "warning.main", mb: 1 }} />
              <Typography variant="h4">{avgConferencePapers}</Typography>
              <Typography variant="body2" color="text.secondary">
                Avg Conference Papers
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
              Loading PhD scholars...
            </Typography>
          </Box>
        </Paper>
      ) : filteredData.length === 0 ? (
        <Paper sx={styles.tablePaper}>
          <Box sx={styles.noDataContainer}>
            <SchoolIcon sx={{ fontSize: 80, color: "text.disabled", mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              No students found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {searchQuery
                ? "No students match your search criteria"
                : "No graduated PhD scholars available. Add your first student!"}
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog("add")}
              sx={{ mt: 2 }}
            >
              ADD FIRST STUDENT
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
                        <PersonIcon fontSize="large" />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight={600}>
                          {student.name}
                        </Typography>
                        <Chip
                          label={student.graduating_year}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </Box>
                    </Stack>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <strong>Thesis:</strong> {student.thesis_title}
                    </Typography>

                    <Grid container spacing={1} sx={{ mb: 1 }}>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Journal Papers
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {student.no_of_journal_papers}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Conference Papers
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {student.no_of_conference_papers}
                        </Typography>
                      </Grid>
                    </Grid>

                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                      <WorkIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {student.current_working_status} @ {student.place_of_work}
                      </Typography>
                    </Stack>

                    {student.info && (
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                        {student.info}
                      </Typography>
                    )}
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
                <TableCell sx={styles.tableHeader}>Student</TableCell>
                <TableCell sx={styles.tableHeader}>Thesis Title</TableCell>
                <TableCell sx={styles.tableHeader}>Publications</TableCell>
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
                          <PersonIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="body1" fontWeight={500}>
                            {student.name}
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
                      <Typography variant="body2">
                        {student.thesis_title?.length > 80
                          ? `${student.thesis_title.substring(0, 80)}...`
                          : student.thesis_title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        <strong>{student.no_of_journal_papers}</strong> Journal
                      </Typography>
                      <Typography variant="body2">
                        <strong>{student.no_of_conference_papers}</strong> Conference
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {student.current_working_status}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {student.place_of_work}
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
          {dialogMode === "add" && "Add New PhD Scholar"}
          {dialogMode === "edit" && "Edit PhD Scholar"}
          {dialogMode === "delete" && "Delete PhD Scholar"}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {dialogMode === "delete" ? (
              <Box>
                <Alert severity="warning" sx={{ mb: 2 }}>
                  Are you sure you want to delete this student? This action cannot be undone.
                </Alert>
                {selectedStudent && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body1" gutterBottom>
                      <strong>Name:</strong> {selectedStudent.name}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Graduating Year:</strong> {selectedStudent.graduating_year}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Thesis:</strong> {selectedStudent.thesis_title}
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
                    label="Student Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter student name..."
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
                    type="number"
                    label="No. of Journal Papers"
                    name="no_of_journal_papers"
                    value={formData.no_of_journal_papers}
                    onChange={handleInputChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <ArticleIcon />
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
                    label="No. of Conference Papers"
                    name="no_of_conference_papers"
                    value={formData.no_of_conference_papers}
                    onChange={handleInputChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <DescriptionIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Current Working Status"
                    name="current_working_status"
                    value={formData.current_working_status}
                    onChange={handleInputChange}
                    placeholder="e.g., Assistant Professor"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <WorkIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    label="Thesis Title"
                    name="thesis_title"
                    value={formData.thesis_title}
                    onChange={handleInputChange}
                    multiline
                    rows={2}
                    placeholder="Enter thesis title..."
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    label="Place of Work"
                    name="place_of_work"
                    value={formData.place_of_work}
                    onChange={handleInputChange}
                    placeholder="Enter current workplace..."
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
                    placeholder="Any additional notes..."
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
              {dialogMode === "add" && "Add Student"}
              {dialogMode === "edit" && "Update Student"}
              {dialogMode === "delete" && "Delete Student"}
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

export default PhdGraduated;