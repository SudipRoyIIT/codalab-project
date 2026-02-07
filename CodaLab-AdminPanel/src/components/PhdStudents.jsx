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
  Tabs,
  Tab,
  Link,
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
  Email as EmailIcon,
  LinkedIn as LinkedInIcon,
  Link as LinkIcon,
  Google as GoogleIcon,
  Science as ScienceIcon,
  Close as CloseIcon,
  Psychology as PsychologyIcon,
} from "@mui/icons-material";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3001";

const CurrentPhdStudents = () => {
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
  const [activeTab, setActiveTab] = useState("all");

  // Menu states
  const [currentMenuAnchor, setCurrentMenuAnchor] = useState(null);
  const [graduatedMenuAnchor, setGraduatedMenuAnchor] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    enrolledCourse: "PhD",
    subtitle: "",
    areaOfInterest: "",
    overview: "",
    researches: "",
    publications: {
      journal_publications: [],
      conference_publications: []
    },
    contactInformation: {
      email: "",
      linkedIn: "",
      googleScholarLink: "",
      orcidLink: "",
      researchGateId: "",
      clickForMore: ""
    },
    urlToImage: "",
  });

  // Dynamic arrays for publications
  const [journalPublications, setJournalPublications] = useState([""]);
  const [conferencePublications, setConferencePublications] = useState([""]);

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Fetch all current PhD students
  const fetchData = async () => {
    setLoading(true);
    try {
      const userRole = localStorage.getItem("userInfo");
      const afApi = userRole === "admin" ? "Admin" : "Subadmin";
      
      const url = `${BASE_URL}/api/${afApi}/private/getCurrentStudents?name=${searchQuery}&_=${Date.now()}`;
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
        const phdData = data.filter((student) => student.enrolledCourse === "PhD");
        setStudentsData(phdData);
        
        if (phdData.length === 0) {
          toast.info("No current PhD scholars found");
        } else {
          toast.success(`Loaded ${phdData.length} current PhD scholar${phdData.length > 1 ? 's' : ''}`);
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
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle publications array changes
  const handleJournalPubChange = (index, value) => {
    const newJournals = [...journalPublications];
    newJournals[index] = value;
    setJournalPublications(newJournals);
  };

  const handleConferencePubChange = (index, value) => {
    const newConferences = [...conferencePublications];
    newConferences[index] = value;
    setConferencePublications(newConferences);
  };

  const addJournalPub = () => {
    setJournalPublications([...journalPublications, ""]);
  };

  const addConferencePub = () => {
    setConferencePublications([...conferencePublications, ""]);
  };

  const removeJournalPub = (index) => {
    if (journalPublications.length > 1) {
      const newJournals = journalPublications.filter((_, i) => i !== index);
      setJournalPublications(newJournals);
    }
  };

  const removeConferencePub = (index) => {
    if (conferencePublications.length > 1) {
      const newConferences = conferencePublications.filter((_, i) => i !== index);
      setConferencePublications(newConferences);
    }
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, urlToImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Open dialog for add/edit/delete
  const handleOpenDialog = (mode, student = null) => {
    setDialogMode(mode);
    setSelectedStudent(student);

    if (mode === "edit" && student) {
      setFormData({
        name: student.name || "",
        enrolledCourse: student.enrolledCourse || "PhD",
        subtitle: student.subtitle || "",
        areaOfInterest: student.areaOfInterest || "",
        overview: student.overview || "",
        researches: student.researches || "",
        publications: student.publications || { journal_publications: [], conference_publications: [] },
        contactInformation: student.contactInformation || {
          email: "",
          linkedIn: "",
          googleScholarLink: "",
          orcidLink: "",
          researchGateId: "",
          clickForMore: ""
        },
        urlToImage: student.urlToImage || "",
      });
      
      const journals = student.publications?.journal_publications || [];
      const conferences = student.publications?.conference_publications || [];
      
      setJournalPublications(journals.length > 0 ? journals : [""]);
      setConferencePublications(conferences.length > 0 ? conferences : [""]);
      
    } else if (mode === "add") {
      setFormData({
        name: "",
        enrolledCourse: "PhD",
        subtitle: "",
        areaOfInterest: "",
        overview: "",
        researches: "",
        publications: {
          journal_publications: [],
          conference_publications: []
        },
        contactInformation: {
          email: "",
          linkedIn: "",
          googleScholarLink: "",
          orcidLink: "",
          researchGateId: "",
          clickForMore: ""
        },
        urlToImage: "",
      });
      setJournalPublications([""]);
      setConferencePublications([""]);
    }

    setDialogOpen(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setFormData({
      name: "",
      enrolledCourse: "PhD",
      subtitle: "",
      areaOfInterest: "",
      overview: "",
      researches: "",
      publications: {
        journal_publications: [],
        conference_publications: []
      },
      contactInformation: {
        email: "",
        linkedIn: "",
        googleScholarLink: "",
        orcidLink: "",
        researchGateId: "",
        clickForMore: ""
      },
      urlToImage: "",
    });
    setJournalPublications([""]);
    setConferencePublications([""]);
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

      const preparedPublications = {
        journal_publications: journalPublications.filter(j => j && j.trim() !== ""),
        conference_publications: conferencePublications.filter(c => c && c.trim() !== "")
      };

      if (dialogMode === "add") {
        const requiredFields = ["name", "enrolledCourse", "subtitle", "areaOfInterest", "overview", "researches", "urlToImage"];
        const missingFields = requiredFields.filter((field) => !formData[field]);

        if (missingFields.length > 0) {
          toast.error(`Please fill in: ${missingFields.join(", ")}`);
          return;
        }

        endpoint = `${BASE_URL}/api/${afApi}/private/createStudent`;
        method = "POST";
        payload = {
          ...formData,
          publications: preparedPublications
        };
      } else if (dialogMode === "edit" && selectedStudent) {
        const requiredFields = ["name", "enrolledCourse", "subtitle", "areaOfInterest", "overview", "researches"];
        const missingFields = requiredFields.filter((field) => !formData[field]);

        if (missingFields.length > 0) {
          toast.error(`Please fill in: ${missingFields.join(", ")}`);
          return;
        }

        endpoint = `${BASE_URL}/api/${afApi}/private/updateStudent/${selectedStudent._id}`;
        method = "PUT";
        payload = {
          ...formData,
          publications: preparedPublications
        };
      } else if (dialogMode === "delete" && selectedStudent) {
        endpoint = `${BASE_URL}/api/${afApi}/private/deleteStudent/${selectedStudent._id}`;
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
        toast.success(`Student ${action} successfully!`);
        handleCloseDialog();
        fetchData();
      } else {
        const errorText = await response.text();
        try {
          const errorJson = JSON.parse(errorText);
          toast.error(errorJson.message || `Failed to ${dialogMode} student`);
        } catch {
          toast.error(`Failed to ${dialogMode} student: ${errorText}`);
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
    const area = student.areaOfInterest || "";
    const research = student.researches || "";
    const subtitle = student.subtitle || "";

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !name.toLowerCase().includes(query) &&
        !area.toLowerCase().includes(query) &&
        !research.toLowerCase().includes(query) &&
        !subtitle.toLowerCase().includes(query)
      ) {
        return false;
      }
    }

    if (activeTab === "withPublications") {
      const hasPublications = 
        (student.publications?.journal_publications?.length > 0) ||
        (student.publications?.conference_publications?.length > 0);
      return hasPublications;
    }

    return true;
  });

  // Statistics
  const totalStudents = studentsData.length;
  const studentsWithPublications = studentsData.filter(s => 
    (s.publications?.journal_publications?.length > 0) || 
    (s.publications?.conference_publications?.length > 0)
  ).length;

  const totalJournalPubs = studentsData.reduce((sum, s) => 
    sum + (s.publications?.journal_publications?.length || 0), 0
  );

  const totalConferencePubs = studentsData.reduce((sum, s) => 
    sum + (s.publications?.conference_publications?.length || 0), 0
  );

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
            {filteredData.length} current PhD scholar(s) found
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
            variant="contained"
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
              placeholder="Search by name, research area, or interests..."
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

      {/* Tabs for filtering */}
      <Paper sx={{ mb: 3, p: 1 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="All Students" value="all" />
          <Tab label="With Publications" value="withPublications" />
        </Tabs>
      </Paper>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={styles.statCard}>
            <Box sx={styles.statCardContent}>
              <PersonIcon sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
              <Typography variant="h4">{totalStudents}</Typography>
              <Typography variant="body2" color="text.secondary">
                Current PhD Scholars
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={styles.statCard}>
            <Box sx={styles.statCardContent}>
              <ArticleIcon sx={{ fontSize: 40, color: "success.main", mb: 1 }} />
              <Typography variant="h4">{studentsWithPublications}</Typography>
              <Typography variant="body2" color="text.secondary">
                With Publications
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={styles.statCard}>
            <Box sx={styles.statCardContent}>
              <DescriptionIcon sx={{ fontSize: 40, color: "warning.main", mb: 1 }} />
              <Typography variant="h4">{totalJournalPubs}</Typography>
              <Typography variant="body2" color="text.secondary">
                Total Journal Papers
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={styles.statCard}>
            <Box sx={styles.statCardContent}>
              <ScienceIcon sx={{ fontSize: 40, color: "info.main", mb: 1 }} />
              <Typography variant="h4">{totalConferencePubs}</Typography>
              <Typography variant="body2" color="text.secondary">
                Total Conference Papers
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
              Loading current PhD scholars...
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
                : "No current PhD scholars available. Add your first student!"}
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
                      <Avatar 
                        src={student.urlToImage}
                        sx={{ width: 56, height: 56, bgcolor: "primary.main" }}
                      >
                        {!student.urlToImage && <PersonIcon fontSize="large" />}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight={600} noWrap>
                          {student.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {student.subtitle}
                        </Typography>
                        <Chip
                          label={student.enrolledCourse}
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ mt: 0.5 }}
                        />
                      </Box>
                    </Stack>

                    {/* Research Area with Chips */}
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary" fontWeight={500} sx={{ mb: 0.5, display: 'block' }}>
                        Research Area:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {student.areaOfInterest?.split(',').slice(0, 3).map((area, idx) => (
                          <Chip
                            key={idx}
                            label={area.trim()}
                            size="small"
                            variant="outlined"
                            color="primary"
                            sx={{ fontSize: '0.7rem', height: '24px' }}
                          />
                        ))}
                        {student.areaOfInterest?.split(',').length > 3 && (
                          <Chip
                            label={`+${student.areaOfInterest.split(',').length - 3} more`}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem', height: '24px' }}
                          />
                        )}
                      </Box>
                    </Box>

                    <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem' }}>
                      {student.overview?.length > 120 
                        ? `${student.overview.substring(0, 120)}...` 
                        : student.overview}
                    </Typography>

                    <Grid container spacing={1} sx={{ mb: 1 }}>
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <ArticleIcon fontSize="small" color="action" />
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Journal
                            </Typography>
                            <Typography variant="body1" fontWeight={600}>
                              {student.publications?.journal_publications?.length || 0}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <DescriptionIcon fontSize="small" color="action" />
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Conference
                            </Typography>
                            <Typography variant="body1" fontWeight={600}>
                              {student.publications?.conference_publications?.length || 0}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>

                    {/* Contact Links */}
                    {student.contactInformation && (
                      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                        {student.contactInformation.email && (
                          <Tooltip title="Email">
                            <IconButton size="small" href={`mailto:${student.contactInformation.email}`}>
                              <EmailIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {student.contactInformation.linkedIn && (
                          <Tooltip title="LinkedIn">
                            <IconButton size="small" href={student.contactInformation.linkedIn} target="_blank">
                              <LinkedInIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {student.contactInformation.googleScholarLink && (
                          <Tooltip title="Google Scholar">
                            <IconButton size="small" href={student.contactInformation.googleScholarLink} target="_blank">
                              <GoogleIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Stack>
                    )}
                  </CardContent>
                  <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
                    <Button 
                      size="small" 
                      onClick={() => {/* Add view details functionality */}}
                    >
                      View Details
                    </Button>
                    <Stack direction="row">
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
                    </Stack>
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
                <TableCell sx={styles.tableHeader}>Research Area</TableCell>
                <TableCell sx={styles.tableHeader}>Publications</TableCell>
                <TableCell sx={styles.tableHeader}>Contact</TableCell>
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
                        <Avatar 
                          src={student.urlToImage}
                          sx={{ bgcolor: "primary.main", width: 40, height: 40 }}
                        >
                          <PersonIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="body1" fontWeight={500} noWrap sx={{ width: '150px' }}>
                            {student.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" noWrap sx={{ width: '150px', display: 'block' }}>
                            {student.subtitle}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ maxWidth: '200px', minWidth: '150px' }}>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {student.areaOfInterest?.split(',').slice(0, 2).map((area, idx) => (
                          <Chip
                            key={idx}
                            label={area.trim()}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem', height: '22px' }}
                          />
                        ))}
                        {student.areaOfInterest?.split(',').length > 2 && (
                          <Tooltip title={student.areaOfInterest}>
                            <Chip
                              label={`+${student.areaOfInterest.split(',').length - 2} more`}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: '0.7rem', height: '22px' }}
                            />
                          </Tooltip>
                        )}
                      </Box>
                      {student.researches && (
                        <Tooltip title={student.researches}>
                          <Typography 
                            variant="caption" 
                            color="text.secondary" 
                            sx={{ 
                              display: 'block',
                              mt: 0.5,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              maxWidth: '200px'
                            }}
                          >
                            {student.researches}
                          </Typography>
                        </Tooltip>
                      )}
                    </TableCell>
                    <TableCell>
                      <Stack spacing={0.5} sx={{ minWidth: '120px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <ArticleIcon fontSize="small" color="action" />
                          <Typography variant="body2">
                            <strong>{student.publications?.journal_publications?.length || 0}</strong>
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <DescriptionIcon fontSize="small" color="action" />
                          <Typography variant="body2">
                            <strong>{student.publications?.conference_publications?.length || 0}</strong>
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ minWidth: '150px' }}>
                      <Stack spacing={0.5}>
                        {student.contactInformation?.email && (
                          <Tooltip title={student.contactInformation.email}>
                            <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <EmailIcon fontSize="small" /> 
                              <Box sx={{ 
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                maxWidth: '120px'
                              }}>
                                {student.contactInformation.email}
                              </Box>
                            </Typography>
                          </Tooltip>
                        )}
                        {student.contactInformation?.linkedIn && (
                          <Tooltip title={student.contactInformation.linkedIn}>
                            <Link 
                              href={student.contactInformation.linkedIn} 
                              target="_blank" 
                              variant="caption" 
                              sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                            >
                              <LinkedInIcon fontSize="small" /> LinkedIn
                            </Link>
                          </Tooltip>
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell align="center" sx={{ minWidth: '100px' }}>
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
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
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
                      <strong>Research Area:</strong> {selectedStudent.areaOfInterest}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Subtitle:</strong> {selectedStudent.subtitle}
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
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Enrolled Course"
                    name="enrolledCourse"
                    value={formData.enrolledCourse}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Subtitle"
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleInputChange}
                    placeholder="e.g., Research Scholar"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Area of Interest"
                    name="areaOfInterest"
                    value={formData.areaOfInterest}
                    onChange={handleInputChange}
                    placeholder="e.g., Machine Learning, NLP (comma separated)"
                    helperText="Separate multiple areas with commas"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    label="Overview"
                    name="overview"
                    value={formData.overview}
                    onChange={handleInputChange}
                    multiline
                    rows={2}
                    placeholder="Brief overview of research..."
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    label="Researches"
                    name="researches"
                    value={formData.researches}
                    onChange={handleInputChange}
                    multiline
                    rows={2}
                    placeholder="Detailed research description..."
                  />
                </Grid>

                {/* Journal Publications */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Journal Publications
                  </Typography>
                  {journalPublications.map((journal, index) => (
                    <Box key={index} sx={{ display: 'flex', gap: 2, mb: 1, alignItems: 'center' }}>
                      <TextField
                        fullWidth
                        label={`Journal ${index + 1}`}
                        value={journal}
                        onChange={(e) => handleJournalPubChange(index, e.target.value)}
                        size="small"
                        placeholder="Enter journal publication title/DOI"
                      />
                      {journalPublications.length > 1 && (
                        <IconButton
                          size="small"
                          onClick={() => removeJournalPub(index)}
                          color="error"
                        >
                          <CloseIcon />
                        </IconButton>
                      )}
                    </Box>
                  ))}
                  <Button
                    variant="outlined"
                    onClick={addJournalPub}
                    startIcon={<AddIcon />}
                    sx={{ mt: 1 }}
                  >
                    Add Journal Publication
                  </Button>
                </Grid>

                {/* Conference Publications */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Conference Publications
                  </Typography>
                  {conferencePublications.map((conference, index) => (
                    <Box key={index} sx={{ display: 'flex', gap: 2, mb: 1, alignItems: 'center' }}>
                      <TextField
                        fullWidth
                        label={`Conference ${index + 1}`}
                        value={conference}
                        onChange={(e) => handleConferencePubChange(index, e.target.value)}
                        size="small"
                        placeholder="Enter conference publication title/DOI"
                      />
                      {conferencePublications.length > 1 && (
                        <IconButton
                          size="small"
                          onClick={() => removeConferencePub(index)}
                          color="error"
                        >
                          <CloseIcon />
                        </IconButton>
                      )}
                    </Box>
                  ))}
                  <Button
                    variant="outlined"
                    onClick={addConferencePub}
                    startIcon={<AddIcon />}
                    sx={{ mt: 1 }}
                  >
                    Add Conference Publication
                  </Button>
                </Grid>

                {/* Contact Information */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Contact Information
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    type="email"
                    label="Email"
                    name="contactInformation.email"
                    value={formData.contactInformation.email}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="LinkedIn Profile"
                    name="contactInformation.linkedIn"
                    value={formData.contactInformation.linkedIn}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Google Scholar Link"
                    name="contactInformation.googleScholarLink"
                    value={formData.contactInformation.googleScholarLink}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="ORCID Link"
                    name="contactInformation.orcidLink"
                    value={formData.contactInformation.orcidLink}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Research Gate ID"
                    name="contactInformation.researchGateId"
                    value={formData.contactInformation.researchGateId}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Additional Information"
                    name="contactInformation.clickForMore"
                    value={formData.contactInformation.clickForMore}
                    onChange={handleInputChange}
                    multiline
                    rows={2}
                    placeholder="Any additional information..."
                  />
                </Grid>

                {/* Image Upload */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Profile Image
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {formData.urlToImage && (
                      <Avatar
                        src={formData.urlToImage}
                        sx={{ width: 80, height: 80 }}
                      />
                    )}
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<PersonIcon />}
                    >
                      Upload Image
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </Button>
                  </Box>
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

export default CurrentPhdStudents;