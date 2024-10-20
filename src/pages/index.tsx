import { useState, useEffect } from 'react';

export default function ABTest() {
  const [products, setProducts] = useState([
    { name: 'Hair cream', originPrice: 30, testPrice: '' },
  ]);
  const [message, setMessage] = useState(''); // State to show success/failure message
  const [tests, setTests] = useState([]); // State to store existing tests

  const handlePriceChange = (index: number, value: string) => {
    const updatedProducts = [...products];
    updatedProducts[index].testPrice = value;
    setProducts(updatedProducts);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ price: products[0].testPrice }),
      });

      if (response.ok) {
        setMessage('Test created');
        fetchTests(); // Refresh the tests list after submission

        // Hide the message after 5 seconds
        setTimeout(() => {
          setMessage('');
        }, 5000);
      } else {
        setMessage('Create failed');
      }
    } catch (error) {
      console.error('Error submitting test prices:', error);
      setMessage('Create failed');
    }
  };

  // Fetch existing tests from the API
  const fetchTests = async () => {
    try {
      const response = await fetch('/api/test');
      const data = await response.json();
      setTests(data); // Store the fetched tests
    } catch (error) {
      console.error('Error fetching tests:', error);
    }
  };

  // Fetch the tests when the component mounts
  useEffect(() => {
    fetchTests();
  }, []);

  return (
    <div style={{ backgroundColor: 'white', padding: '20px', height: '100vh' }}>
      <h1 style={{ color: 'black' }}>Create new Price test here</h1>
      <form onSubmit={handleSubmit}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            color: 'black',
          }}
        >
          <thead>
            <tr>
              <th style={{ ...tableHeaderStyle, textAlign: 'left' }}>Product</th>
              <th style={{ ...tableHeaderStyle, textAlign: 'left' }}>Origin Price</th>
              <th style={{ ...tableHeaderStyle, textAlign: 'left' }}>Test Price</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={index}>
                <td style={tableCellStyle}>{product.name}</td>
                <td style={tableCellStyle}>${product.originPrice.toFixed(2)}</td>
                <td style={tableCellStyle}>
                  <input
                    type="number"
                    value={product.testPrice}
                    onChange={(e) => handlePriceChange(index, e.target.value)}
                    placeholder="Enter Test Price"
                    style={{
                      width: '100%',
                      padding: '8px',
                      color: 'black',
                      border: '1px solid black',
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          type="submit"
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#90ee90', // Light green
            border: 'none',
            color: 'black',
            cursor: 'pointer',
            borderRadius: '5px',
            fontWeight: 'bold',
          }}
        >
          Submit Test Prices
        </button>
      </form>

      {message && (
        <p style={{ marginTop: '20px', color: message === 'Test created' ? 'green' : 'red' }}>
          {message}
        </p>
      )}
      <hr style={{
        border: 'none',
        height: '2px',
        backgroundColor: '#333',
        margin: '30px 0'
      }} />

      {/* Existing Tests Section */}
      <h1 style={{ color: 'black', marginTop: '40px' }}>Existing Tests</h1>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          color: 'black',
        }}
      >
        <thead>
          <tr>
            <th style={{...tableHeaderStyle, textAlign: 'left' as const}}>Test ID</th>
            <th style={{...tableHeaderStyle, textAlign: 'left' as const}}>Test Price</th>
          </tr>
        </thead>
        <tbody>
          {tests.map((test: { id: string; price: number }) => (
            <tr key={test.id}>
              <td style={tableCellStyle}>{test.id}</td>
              <td style={tableCellStyle}>${test.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const tableHeaderStyle = {
  border: '1px solid black',
  padding: '10px',
  textAlign: 'left',
  backgroundColor: '#f2f2f2',
  fontWeight: 'bold',
  color: 'black',
};

const tableCellStyle = {
  border: '1px solid black',
  padding: '10px',
  color: 'black',
};
