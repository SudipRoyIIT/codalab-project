// Dashboard.jsx - Modern redesigned dashboard
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  Box,
  Chip,
  Avatar,
  Divider,
  LinearProgress,
} from "@mui/material";
import {
  Article as ArticleIcon,
  Science as ScienceIcon,
  Work as WorkIcon,
  Announcement as AnnouncementIcon,
  School as SchoolIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import SimpleCalendar from "./SimpleCalendar";

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  // Statistics data - you can fetch this from API
  const stats = [
    {
      title: "Publications",
      count: "156",
      icon: <ArticleIcon sx={{ fontSize: 40 }} />,
      color: "#1976d2",
      bgColor: "#e3f2fd",
      description: "Total research publications",
      trend: "+12% this month",
    },
    {
      title: "Research Areas",
      count: "8",
      icon: <ScienceIcon sx={{ fontSize: 40 }} />,
      color: "#2e7d32",
      bgColor: "#e8f5e9",
      description: "Active research domains",
      trend: "+2 new areas",
    },
    {
      title: "Projects",
      count: "24",
      icon: <WorkIcon sx={{ fontSize: 40 }} />,
      color: "#ed6c02",
      bgColor: "#fff3e0",
      description: "Ongoing & funded projects",
      trend: "6 ongoing",
    },
    {
      title: "Announcements",
      count: "42",
      icon: <AnnouncementIcon sx={{ fontSize: 40 }} />,
      color: "#9c27b0",
      bgColor: "#f3e5f5",
      description: "Recent updates & news",
      trend: "3 this week",
    },
    {
      title: "Teachings",
      count: "18",
      icon: <SchoolIcon sx={{ fontSize: 40 }} />,
      color: "#0288d1",
      bgColor: "#e1f5fe",
      description: "Semester courses",
      trend: "Spring & Autumn",
    },
    {
      title: "Students",
      count: "67",
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      color: "#d32f2f",
      bgColor: "#ffebee",
      description: "Current & graduated",
      trend: "42 current",
    },
  ];

  return (
    <Box sx={styles.container}>
      {/* Header Section */}
      <Box sx={styles.header}>
        <Box>
          <Typography variant="h3" sx={styles.title}>
            Admin Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Welcome back! Here's what's happening with your academic management.
          </Typography>
        </Box>
        <Box sx={styles.dateTimeBox}>
          <Chip
            icon={<CalendarIcon />}
            label={currentTime.toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
            color="primary"
            sx={{ mb: 1 }}
          />
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
            {currentTime.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Quick Stats Section */}
      <Typography variant="h5" sx={styles.sectionTitle}>
        📊 Quick Statistics
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={styles.statCard}>
              <CardContent>
                <Box sx={styles.statCardHeader}>
                  <Avatar
                    sx={{
                      bgcolor: stat.bgColor,
                      color: stat.color,
                      width: 60,
                      height: 60,
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                  <Box sx={{ flex: 1, ml: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: stat.color }}>
                      {stat.count}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ my: 1.5 }} />
                <Typography variant="caption" color="text.secondary" display="block">
                  {stat.description}
                </Typography>
                <Chip
                  label={stat.trend}
                  size="small"
                  icon={<TrendingUpIcon sx={{ fontSize: 16 }} />}
                  sx={{ mt: 1, fontSize: '0.75rem' }}
                  color="success"
                  variant="outlined"
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Main Management Cards */}
      <Typography variant="h5" sx={styles.sectionTitle}>
        🎯 Management Sections
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          {
            title: "Publications",
            description: "Manage Journals, Conferences, Books, Patents & Workshops",
            icon: "📚",
            color: "#1976d2",
          },
          {
            title: "Research",
            description: "Manage Research Areas and Focus Domains",
            icon: "🔬",
            color: "#2e7d32",
          },
          {
            title: "Projects",
            description: "Manage Ongoing and Funded Research Projects",
            icon: "💼",
            color: "#ed6c02",
          },
          {
            title: "Teachings",
            description: "Manage Semester Courses and Academic Programs",
            icon: "🎓",
            color: "#0288d1",
          },
          {
            title: "Students",
            description: "Manage Current and Graduated Students",
            icon: "👥",
            color: "#d32f2f",
          },
          {
            title: "Highlights",
            description: "Manage News, Events, Announcements & Gallery",
            icon: "📢",
            color: "#9c27b0",
          },
        ].map((section, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={styles.managementCard}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h2" sx={{ mr: 2 }}>
                    {section.icon}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: section.color }}>
                    {section.title}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {section.description}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={Math.random() * 100}
                  sx={{ mt: 2, height: 6, borderRadius: 3 }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Calendar Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={styles.calendarPaper}>
            <Box sx={styles.calendarHeader}>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                📅 Calendar
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Select a date to view events
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <SimpleCalendar onDateSelect={handleDateSelect} />
          </Paper>
        </Grid>

        {/* Selected Date & Quick Info */}
        <Grid item xs={12} md={4}>
          {selectedDate ? (
            <Paper sx={styles.selectedDatePaper}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Selected Date
              </Typography>
              <Box sx={styles.selectedDateBox}>
                <CalendarIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  {selectedDate.format("DD")}
                </Typography>
                <Typography variant="h6">
                  {selectedDate.format("MMMM YYYY")}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {selectedDate.format("dddd")}
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" color="text.secondary">
                No events scheduled for this date.
              </Typography>
            </Paper>
          ) : (
            <Paper sx={styles.selectedDatePaper}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Quick Info
              </Typography>
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <CalendarIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  Select a date from the calendar to view events and activities.
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" color="text.secondary">
                <strong>Tip:</strong> Click on any date in the calendar to see scheduled events.
              </Typography>
            </Paper>
          )}

          {/* System Status */}
          <Paper sx={{ ...styles.selectedDatePaper, mt: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              System Status
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Database</Typography>
                <Chip label="Online" size="small" color="success" />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Storage</Typography>
                <Chip label="78%" size="small" color="info" />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Last Backup</Typography>
                <Typography variant="caption" color="text.secondary">
                  2 hours ago
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
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
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 2,
    mb: 2,
  },
  title: {
    fontWeight: 700,
    color: 'var(--primary-color)',
    fontFamily: 'Abhaya Libre, serif',
  },
  dateTimeBox: {
    textAlign: 'right',
  },
  sectionTitle: {
    fontWeight: 600,
    mb: 2,
    color: 'text.primary',
  },
  statCard: {
    height: '100%',
    borderRadius: 'var(--border-radius-md)',
    boxShadow: 'var(--shadow-sm)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: 'var(--shadow-md)',
    },
  },
  statCardHeader: {
    display: 'flex',
    alignItems: 'center',
  },
  managementCard: {
    height: '100%',
    borderRadius: 'var(--border-radius-md)',
    boxShadow: 'var(--shadow-sm)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: 'var(--shadow-md)',
    },
  },
  calendarPaper: {
    p: 3,
    borderRadius: 'var(--border-radius-md)',
    boxShadow: 'var(--shadow-sm)',
    height: '100%',
  },
  calendarHeader: {
    mb: 2,
  },
  selectedDatePaper: {
    p: 3,
    borderRadius: 'var(--border-radius-md)',
    boxShadow: 'var(--shadow-sm)',
    textAlign: 'center',
  },
  selectedDateBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    py: 2,
  },
};

export default Dashboard;