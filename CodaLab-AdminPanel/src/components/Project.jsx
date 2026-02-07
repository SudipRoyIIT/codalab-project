// Project.jsx - Complete redesign based on Research page
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
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Work as WorkIcon,
  Refresh as RefreshIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as OngoingIcon,
  CheckCircle as CompletedIcon,
} from "@mui/icons-material";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3001";

const Project = () => {
  const userRole = localStorage.getItem("userInfo");
  const afApi = userRole === "admin" ? "Admin" : "Subadmin";

  // States
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});

  // Form state
  const [formData, setFormData] = useState({
    projectTitle: "",
    status: "",
    typeOfProject: "",
    sponsors: "",
    roleInProject: "",
    collaboration: "",
    total_grant_inr: "",
    total_grant_usd: "",
    date: "",
    start_date: "",
    end_date: "",
    additionalInfo: "",
  });

  // Load all projects on mount
  useEffect(() => {
    loadAllProjects();
  }, []);

  // Load ALL projects
  const loadAllProjects = async () => {
    setLoading(true);
    try {
      console.log("📡 Loading all projects...");

      // Search with multiple common terms to get all projects
      const searchTerms = ['a', 'e', 'i', 'o', 'u', 'project', 'research', 'development', 'study', 'investigation'];
      const allResults = new Map();

      for (const term of searchTerms) {
        try {
          const endpoint = `${BASE_URL}/api/${afApi}/private/getASingleProjectOnBasisProjects/${encodeURIComponent(term)}`;

          const response = await fetch(endpoint, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authorization: "Bearer " + localStorage.getItem("accessToken"),
            },
          });

          if (response.ok) {
            const data = await response.json();
            let projectData = [];

            if (Array.isArray(data)) {
              projectData = data;
            } else if (data && data.DataForUpdate) {
              projectData = data.DataForUpdate;
            } else if (data && data.projectTitle) {
              projectData = [data];
            }

            projectData.forEach(item => {
              if (item._id) {
                allResults.set(item._id, item);
              }
            });
          }
        } catch (error) {
          console.error(`Error searching with term "${term}":`, error);
        }
      }

      const combinedResults = Array.from(allResults.values());

      console.log(`✅ Loaded ${combinedResults.length} unique projects`);

      setAllProjects(combinedResults);
      setProjects(combinedResults);

      if (combinedResults.length > 0) {
        toast.success(`Loaded ${combinedResults.length} projects`);
      }
    } catch (error) {
      console.error("💥 Error loading projects:", error);
      toast.error("Failed to load projects");
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

  // Search projects
  const searchProjects = (title) => {
    if (!title || title.trim() === "") {
      setProjects(allProjects);
      return;
    }

    const searchTerm = title.toLowerCase();
    const filtered = allProjects.filter(item =>
      item.projectTitle.toLowerCase().includes(searchTerm) ||
      item.sponsors.toLowerCase().includes(searchTerm) ||
      item.typeOfProject.toLowerCase().includes(searchTerm)
    );

    setProjects(filtered);
    setPage(0);

    if (filtered.length === 0) {
      toast.info(`No projects found for "${title}"`);
    } else {
      toast.success(`Found ${filtered.length} project(s)`);
    }
  };

  const handleSearch = () => {
    searchProjects(searchTitle);
  };

  const handleClearSearch = () => {
    setSearchTitle("");
    setProjects(allProjects);
    setPage(0);
  };

  const handleRefresh = () => {
    setSearchTitle("");
    setExpandedRows({});
    loadAllProjects();
  };

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Dialog handlers
  const handleOpenDialog = (mode, project = null) => {
    setDialogMode(mode);
    setSelectedProject(project);

    if (mode === 'edit' && project) {
      setFormData({
        projectTitle: project.projectTitle || "",
        status: project.status === true || project.status === "Ongoing Project" ? "Ongoing Project" : "Funded Project",
        typeOfProject: project.typeOfProject || "",
        sponsors: project.sponsors || "",
        roleInProject: project.roleInProject || "",
        collaboration: project.collaboration || "",
        total_grant_inr: project.total_grant_inr || "",
        total_grant_usd: project.total_grant_usd || "",
        date: project.date || "",
        start_date: project.start_date || "",
        end_date: project.end_date || "",
        additionalInfo: project.additionalInfo || "",
      });
    } else if (mode === 'add') {
      setFormData({
        projectTitle: "",
        status: "",
        typeOfProject: "",
        sponsors: "",
        roleInProject: "",
        collaboration: "",
        total_grant_inr: "",
        total_grant_usd: "",
        date: "",
        start_date: "",
        end_date: "",
        additionalInfo: "",
      });
    }

    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setFormData({
      projectTitle: "",
      status: "",
      typeOfProject: "",
      sponsors: "",
      roleInProject: "",
      collaboration: "",
      total_grant_inr: "",
      total_grant_usd: "",
      date: "",
      start_date: "",
      end_date: "",
      additionalInfo: "",
    });
    setSelectedProject(null);
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (dialogMode !== 'delete') {
      const requiredFields = [
        "projectTitle",
        "status",
        "typeOfProject",
        "sponsors",
        "total_grant_inr",
        "start_date"
      ];

      for (let field of requiredFields) {
        if (!formData[field]) {
          toast.error(`Please fill out the ${field.replace(/_/g, ' ')} field`);
          return;
        }
      }
    }

    // Prepare payload
    const payload = {
      ...formData,
      status: formData.status === "Ongoing Project" ? true : false,
    };

    setLoading(true);
    try {
      let endpoint = '';
      let method = '';

      if (dialogMode === 'add') {
        endpoint = `${BASE_URL}/api/${afApi}/private/createProject`;
        method = 'POST';
      } else if (dialogMode === 'edit' && selectedProject) {
        endpoint = `${BASE_URL}/api/${afApi}/private/updateProject/${selectedProject._id}`;
        method = 'PUT';
      } else if (dialogMode === 'delete' && selectedProject) {
        endpoint = `${BASE_URL}/api/${afApi}/private/DeleteProject/${selectedProject._id}`;
        method = 'DELETE';
      }

      console.log(`Making ${method} request to:`, endpoint);

      const response = await fetch(endpoint, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
        body: method !== 'DELETE' ? JSON.stringify(payload) : undefined,
      });

      if (response.ok) {
        const action = dialogMode === 'add' ? 'added' :
          dialogMode === 'edit' ? 'updated' : 'deleted';
        toast.success(`Project ${action} successfully!`);
        handleCloseDialog();

        await loadAllProjects();

        if (searchTitle.trim()) {
          setSearchTitle("");
        }
      } else {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        toast.error(`Failed to ${dialogMode} project`);
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
  const ongoingProjects = allProjects.filter(p => p.status === true || p.status === "Ongoing Project").length;
  const fundedProjects = allProjects.filter(p => p.status === false || p.status === "Funded Project").length;

  return (
    <Box sx={styles.container}>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <Box sx={styles.header}>
        <Box>
          <Typography variant="h4" sx={styles.title}>
            <WorkIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Projects Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total: {allProjects.length} projects | Ongoing: {ongoingProjects} | Completed: {fundedProjects}
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog('add')}
            sx={styles.addButton}
          >
            Add New Project
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
              <WorkIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4">{allProjects.length}</Typography>
              <Typography variant="body2" color="text.secondary">
                Total Projects
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={styles.statCard}>
            <Box sx={styles.statCardContent}>
              <OngoingIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4">{ongoingProjects}</Typography>
              <Typography variant="body2" color="text.secondary">
                Ongoing Projects
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={styles.statCard}>
            <Box sx={styles.statCardContent}>
              <CompletedIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h4">{fundedProjects}</Typography>
              <Typography variant="body2" color="text.secondary">
                Funded Projects
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={styles.statCard}>
            <Box sx={styles.statCardContent}>
              <CalendarIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h6" sx={{ fontSize: '1.2rem' }}>
                {new Date().toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Today's Date
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
              placeholder="Search by project title, sponsors, or type..."
              value={searchTitle}
              onChange={(e) => {
                setSearchTitle(e.target.value);
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
                endAdornment: searchTitle && (
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
              disabled={!searchTitle.trim()}
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Projects Table */}
      <TableContainer component={Paper} sx={styles.tablePaper}>
        {loading ? (
          <Box sx={styles.loadingContainer}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Loading projects...
            </Typography>
          </Box>
        ) : projects.length === 0 ? (
          <Box sx={styles.noDataContainer}>
            <WorkIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              No Projects Found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {searchTitle
                ? `No results for "${searchTitle}"`
                : "Start by adding your first project"
              }
            </Typography>
            <Stack direction="row" spacing={2}>
              {searchTitle && (
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
                Add Project
              </Button>
            </Stack>
          </Box>
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={styles.tableHeader} width="50">#</TableCell>
                  <TableCell sx={styles.tableHeader}>Project Title</TableCell>
                  <TableCell sx={styles.tableHeader} width="100">Status</TableCell>
                  <TableCell sx={styles.tableHeader} width="100">Role</TableCell>
                  <TableCell sx={styles.tableHeader} width="150" align="center">Actions</TableCell>
                  <TableCell sx={styles.tableHeader} width="80" align="center">Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {projects
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item, index) => {
                    const isExpanded = expandedRows[item._id];
                    const isOngoing = item.status === true || item.status === "Ongoing Project";

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
                              {item.projectTitle}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block">
                              {item.typeOfProject}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              <strong>Sponsor:</strong> {item.sponsors}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={isOngoing ? "Ongoing" : "Funded"}
                              size="small"
                              color={isOngoing ? "success" : "info"}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={item.roleInProject}
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
                                <Grid container spacing={2}>
                                  <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                      📋 Project Details:
                                    </Typography>
                                    <Typography variant="body2" paragraph>
                                      <strong>Type:</strong> {item.typeOfProject}
                                    </Typography>
                                    <Typography variant="body2" paragraph>
                                      <strong>Sponsors:</strong> {item.sponsors}
                                    </Typography>
                                    <Typography variant="body2" paragraph>
                                      <strong>Role:</strong> {item.roleInProject}
                                    </Typography>
                                    {item.collaboration && (
                                      <Typography variant="body2" paragraph>
                                        <strong>Collaboration:</strong> {item.collaboration}
                                      </Typography>
                                    )}
                                  </Grid>
                                  <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                      💰 Financial & Timeline:
                                    </Typography>
                                    <Typography variant="body2" paragraph>
                                      <strong>Grant (INR):</strong> ₹{item.total_grant_inr}
                                    </Typography>
                                    {item.total_grant_usd && (
                                      <Typography variant="body2" paragraph>
                                        <strong>Grant (USD):</strong> ${item.total_grant_usd}
                                      </Typography>
                                    )}
                                    <Typography variant="body2" paragraph>
                                      <strong>Start Date:</strong> {item.start_date ? new Date(item.start_date).toLocaleDateString() : 'N/A'}
                                    </Typography>
                                    {item.end_date && (
                                      <Typography variant="body2" paragraph>
                                        <strong>End Date:</strong> {new Date(item.end_date).toLocaleDateString()}
                                      </Typography>
                                    )}
                                    {item.date && (
                                      <Typography variant="body2" paragraph>
                                        <strong>Duration:</strong> {item.date}
                                      </Typography>
                                    )}
                                  </Grid>
                                  {item.additionalInfo && (
                                    <Grid item xs={12}>
                                      <Divider sx={{ my: 1 }} />
                                      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                        ℹ️ Additional Information:
                                      </Typography>
                                      <Typography variant="body2">
                                        {item.additionalInfo}
                                      </Typography>
                                    </Grid>
                                  )}
                                </Grid>
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
              count={projects.length}
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
          {dialogMode === 'add' && 'Add New Project'}
          {dialogMode === 'edit' && 'Edit Project'}
          {dialogMode === 'delete' && 'Delete Project'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ mt: 2 }}>
            {dialogMode === 'delete' ? (
              <Box>
                <Alert severity="warning" sx={{ mb: 2 }}>
                  Are you sure you want to delete this project? This action cannot be undone.
                </Alert>
                {selectedProject && (
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                    <Typography variant="body1" gutterBottom>
                      <strong>Title:</strong> {selectedProject.projectTitle}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Type:</strong> {selectedProject.typeOfProject}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Sponsors:</strong> {selectedProject.sponsors}
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
                    label="Project Title"
                    name="projectTitle"
                    value={formData.projectTitle}
                    onChange={handleInputChange}
                    placeholder="Enter project title"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    select
                    label="Status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="Ongoing Project">Ongoing Project</MenuItem>
                    <MenuItem value="Funded Project">Funded Project</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Type of Project"
                    name="typeOfProject"
                    value={formData.typeOfProject}
                    onChange={handleInputChange}
                    placeholder="e.g., Research, Development"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    label="Sponsors"
                    name="sponsors"
                    value={formData.sponsors}
                    onChange={handleInputChange}
                    placeholder="Enter sponsor name"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    select
                    label="Role in Project"
                    name="roleInProject"
                    value={formData.roleInProject}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="PI">PI (Principal Investigator)</MenuItem>
                    <MenuItem value="Co-PI">Co-PI</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Collaboration With"
                    name="collaboration"
                    value={formData.collaboration}
                    onChange={handleInputChange}
                    placeholder="Enter collaboration details"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Total Grant (INR)"
                    name="total_grant_inr"
                    value={formData.total_grant_inr}
                    onChange={handleInputChange}
                    placeholder="Enter amount in INR"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Total Grant (USD)"
                    name="total_grant_usd"
                    value={formData.total_grant_usd}
                    onChange={handleInputChange}
                    placeholder="Enter amount in USD"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    required
                    label="Start Date"
                    name="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="End Date"
                    name="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={handleInputChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Duration"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    placeholder="e.g., 2 years"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Additional Information"
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleInputChange}
                    placeholder="Enter any additional details"
                    multiline
                    rows={3}
                  />
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
              {dialogMode === 'add' && 'Add Project'}
              {dialogMode === 'edit' && 'Update Project'}
              {dialogMode === 'delete' && 'Delete Project'}
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

export default Project;