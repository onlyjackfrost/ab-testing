import { useState } from 'react';
import axios from 'axios';

const tests = [
  {
    name: 'testA',
    prise: 100,
  },
  {
    name: 'testB',
    prise: 200,
  },
  {
    name: 'testC',
    prise: 300,
  },
  {
    name: 'testD',
    prise: 400,
  },
];

async function sendRandomEvent(userCount, setMessage) {
  const start = Date.now();
  const concurrent = 100;
  for (let i = 0; i < userCount; i += concurrent) {
    const user = `user_${i}`;
    const test = tests[Math.floor(Math.random() * tests.length)];
    try {
      await Promise.all(
        Array.from({ length: concurrent }).map(() =>
          axios.post(`/api/event`, {
            type: 'price',
            userId: user,
            testId: test.name,
            properties: {
              price: test.prise,
            },
          })
        )
      );
    } catch (error) {
      console.error('Error sending event:', error);
    }
  }
  const end = Date.now();
  const message = `Time taken: ${end - start} ms, ${(userCount / (end - start)) * 1000} users/s`;
  console.log(message);
  setMessage(message);
}

export default function EventPage() {
  const [userCount, setUserCount] = useState(1000);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const getDefaultDates = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const formatDate = (date) => date.toISOString().split('T')[0];

    return {
      startDate: formatDate(yesterday),
      endDate: formatDate(tomorrow),
    };
  };

  const { startDate: defaultStartDate, endDate: defaultEndDate } = getDefaultDates();
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [results, setResults] = useState([]);

  const handleSendEvents = async () => {
    setLoading(true);
    setMessage('');
    try {
      await sendRandomEvent(userCount, setMessage);
    } catch (error) {
      console.error('Error executing script:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const handleButtonClick = () => {
    if (isMonitoring) {
      // Stop monitoring
      clearInterval(intervalId);
      setIsMonitoring(false);
      setIntervalId(null);
    } else {
      // Start monitoring
      const id = setInterval(() => {
        monitorApi();
      }, 1000); // Send request every second
      setIntervalId(id);
      setIsMonitoring(true);
    }
  };

  const monitorApi = async () => {
    if (!startDate || !endDate) {
      console.log('Please provide both start and end dates.');
      return;
    }

    try {
      const response = await fetch('api/analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'PRICING',
          filters: {
            startDate,
            endDate,
          },
        }),
      });

      const data = await response.json();
      console.log('API response:', data);
      setResults(data);
    } catch (error) {
      console.error('Error fetching API:', error);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Send Random Events</h1>
      <h3>Will send number of events with concurrent 100.</h3>
      <div style={{ marginBottom: '1rem' }}>
        <label>
          Total events:
          <input
            type="number"
            value={userCount}
            onChange={(e) => setUserCount(Number(e.target.value))}
            style={{ marginLeft: '0.5rem', color: 'black' }}
          />
        </label>
      </div>
      <button 
        onClick={handleSendEvents} 
        disabled={loading}
        style={{
          padding: '7px 15px',
          fontSize: '12px',
          backgroundColor: loading ? '#ff4d4d' : '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '1rem',
        }}
      >
        {loading ? 'Sending Events...' : 'Send Events'}
      </button>
      {message && (
        <div style={{ marginTop: '1rem', color: 'green' }}>
          {message}
        </div>
      )}

      <div style={{ padding: '20px', marginTop: '2rem', borderTop: '1px solid #ccc' }}>
        <h1>Monitor Analysis Results</h1>
        <div>
          <label>Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            style={{ marginLeft: '0.5rem', color: 'black' }}
          />
        </div>
        <div>
          <label>End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
            style={{ marginLeft: '0.5rem', color: 'black' }}
          />
        </div>
        <div>
          <button
            onClick={handleButtonClick}
            style={{
              padding: '7px 15px',
              fontSize: '12px',
              backgroundColor: isMonitoring ? '#ff4d4d' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '1rem',
            }}
          >
            {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
          </button>
        </div>
        <div style={{ marginTop: '20px' }}>
          <h2>Analysis Results</h2>
          {results.length > 0 ? (
            <table border="1" cellPadding="10">
              <thead>
                <tr>
                  <th>Test ID</th>
                  <th>User Count</th>
                  <th>Mean Price</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => (
                  <tr key={index}>
                    <td>{result.testId}</td>
                    <td>{result.userCount}</td>
                    <td>{result.meanPrice}</td>
                    <td>{result.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No data available</p>
          )}
        </div>
      </div>
    </div>
  );
}