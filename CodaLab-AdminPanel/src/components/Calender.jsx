import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Stack,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  NavigateBefore as PrevIcon,
  NavigateNext as NextIcon,
  Today as TodayIcon,
} from '@mui/icons-material';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styled from 'styled-components';

const CalendarWrapper = styled.div`
  .react-calendar {
    width: 100%;
    border: none;
    border-radius: 12px;
    font-family: 'Roboto', sans-serif;
    background: transparent;
    padding: 16px;
  }

  /* Navigation */
  .react-calendar__navigation {
    display: flex;
    height: 50px;
    margin-bottom: 16px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 8px;
    padding: 8px;
  }

  .react-calendar__navigation button {
    color: white;
    min-width: 44px;
    background: none;
    font-size: 16px;
    font-weight: 600;
    border-radius: 6px;
    transition: all 0.3s ease;
  }

  .react-calendar__navigation button:enabled:hover,
  .react-calendar__navigation button:enabled:focus {
    background-color: rgba(255, 255, 255, 0.2);
  }

  .react-calendar__navigation button:disabled {
    background-color: transparent;
    opacity: 0.5;
  }

  /* Month & Year Label */
  .react-calendar__navigation__label {
    font-weight: bold;
    font-size: 18px;
    letter-spacing: 0.5px;
  }

  /* Weekdays */
  .react-calendar__month-view__weekdays {
    text-align: center;
    font-weight: 600;
    font-size: 14px;
    color: #667eea;
    margin-bottom: 8px;
    text-transform: uppercase;
  }

  .react-calendar__month-view__weekdays__weekday {
    padding: 12px;
  }

  .react-calendar__month-view__weekdays abbr {
    text-decoration: none;
  }

  /* Days */
  .react-calendar__tile {
    max-width: 100%;
    padding: 16px 8px;
    background: none;
    text-align: center;
    line-height: 20px;
    font-size: 14px;
    font-weight: 500;
    border-radius: 8px;
    transition: all 0.2s ease;
    color: #2d3748;
    position: relative;
  }

  .react-calendar__tile:enabled:hover,
  .react-calendar__tile:enabled:focus {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(102, 126, 234, 0.2);
  }

  /* Today */
  .react-calendar__tile--now {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white !important;
    font-weight: 700;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  .react-calendar__tile--now:enabled:hover,
  .react-calendar__tile--now:enabled:focus {
    background: linear-gradient(135deg, #5568d3 0%, #65408b 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.5);
  }

  /* Selected Date */
  .react-calendar__tile--active {
    background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
    color: white;
    font-weight: 700;
    box-shadow: 0 4px 12px rgba(72, 187, 120, 0.4);
  }

  .react-calendar__tile--active:enabled:hover,
  .react-calendar__tile--active:enabled:focus {
    background: linear-gradient(135deg, #38a169 0%, #2f855a 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(72, 187, 120, 0.5);
  }

  /* Neighboring Month Dates */
  .react-calendar__month-view__days__day--neighboringMonth {
    color: #cbd5e0;
  }

  /* Weekend Dates */
  .react-calendar__month-view__days__day--weekend {
    color: #e53e3e;
  }

  /* Disabled Dates */
  .react-calendar__tile:disabled {
    background-color: transparent;
    color: #e2e8f0;
    cursor: not-allowed;
  }

  /* Year & Decade View */
  .react-calendar__year-view .react-calendar__tile,
  .react-calendar__decade-view .react-calendar__tile,
  .react-calendar__century-view .react-calendar__tile {
    padding: 20px;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .react-calendar__tile {
      padding: 12px 6px;
      font-size: 13px;
    }

    .react-calendar__navigation {
      height: 44px;
    }

    .react-calendar__navigation__label {
      font-size: 16px;
    }
  }
`;

const CustomCalendar = () => {
  const [date, setDate] = useState(new Date());

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleTodayClick = () => {
    setDate(new Date());
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#667eea', mb: 1 }}>
            <CalendarIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 32 }} />
            Calendar
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Select and manage your dates
          </Typography>
        </Box>
        <Tooltip title="Jump to Today">
          <IconButton
            onClick={handleTodayClick}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(135deg, #5568d3 0%, #65408b 100%)',
                transform: 'scale(1.05)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <TodayIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Selected Date Display */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 3,
          boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="caption" sx={{ opacity: 0.9, fontSize: 12 }}>
              Selected Date
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.5 }}>
              {formatDate(date)}
            </Typography>
          </Box>
          <Chip
            icon={<CalendarIcon />}
            label={`${date.toLocaleDateString('en-US', { month: 'short' })} ${date.getDate()}`}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              fontWeight: 600,
              fontSize: 14,
              '& .MuiChip-icon': {
                color: 'white',
              },
            }}
          />
        </Stack>
      </Paper>

      {/* Calendar */}
      <Paper
        sx={{
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
          overflow: 'hidden',
          background: 'linear-gradient(to bottom, #f7fafc 0%, #ffffff 100%)',
        }}
      >
        <CalendarWrapper>
          <Calendar
            onChange={setDate}
            value={date}
            locale="en-US"
            navigationLabel={({ date }) =>
              `${date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
            }
            prevLabel={<PrevIcon />}
            nextLabel={<NextIcon />}
            prev2Label={null}
            next2Label={null}
          />
        </CalendarWrapper>
      </Paper>

      {/* Info Footer */}
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          Click on any date to select it • Today's date is highlighted
        </Typography>
      </Box>
    </Box>
  );
};

export default CustomCalendar;