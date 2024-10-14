import { useState } from 'react';

export default function MonitorPage() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [results, setResults] = useState([]);

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
      console.log("Please provide both start and end dates.");
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/analysis', {
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
    <div style={{ padding: '20px' }}>
      <h1>Monitor API Results</h1>
      <div>
        <label>Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={handleStartDateChange}
        />
      </div>
      <div>
        <label>End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={handleEndDateChange}
        />
      </div>
      <div>
        <button onClick={handleButtonClick}>
          {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
        </button>
      </div>
      <div style={{ marginTop: '20px' }}>
        <h2>Results</h2>
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
  );
}
