import React, { useState } from "react";
import dayjs from "dayjs";
import { Box, Typography, Button, Grid, Paper } from "@mui/material";

const SimpleCalendar = ({ onDateSelect }) => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(null);

  const startOfMonth = currentDate.startOf("month");
  const endOfMonth = currentDate.endOf("month");

  const daysInMonth = endOfMonth.date();

  const handlePreviousMonth = () => {
    setCurrentDate(currentDate.subtract(1, "month"));
  };

  const handleNextMonth = () => {
    setCurrentDate(currentDate.add(1, "month"));
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    onDateSelect(date);
  };

  const renderDays = () => {
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const date = currentDate.date(i);
      const isSelected = selectedDate && selectedDate.isSame(date, "day");
      days.push(
        <Grid item xs={1.7} key={i}>
          <Paper
            sx={{
              padding: "10px",
              backgroundColor: isSelected
                ? "rgba(33, 148, 242, 0.45)"
                : "transparent",
              cursor: "pointer",
              "&:hover": { backgroundColor: "rgba(33, 148, 242, 0.1)" },
            }}
            onClick={() => handleDateClick(date)}
          >
            <Typography>{i}</Typography>
          </Paper>
        </Grid>
      );
    }
    return days;
  };

  return (
    <Box sx={{ textAlign: "center", padding: "20px" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <Button onClick={handlePreviousMonth}>Previous</Button>
        <Typography variant="h6">{currentDate.format("MMMM YYYY")}</Typography>
        <Button onClick={handleNextMonth}>Next</Button>
      </Box>
      <Grid
        container
        spacing={2}
        sx={{ display: "flex", justifyContent: "center" }}
      >
        {renderDays()}
      </Grid>
    </Box>
  );
};

export default SimpleCalendar;
