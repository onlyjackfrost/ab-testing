import { useState, useEffect } from "react";
import { useRouter } from "next/router";

type PurchaseStyle = {
  "subscribe-and-save": number;
  "one-time-purchase": number;
};

type TestData = {
  testId: string;
  unitPrice: number;
  purchaseCount: number;
  meanPrice: string;
  revenue: string;
  purchaseStyle: PurchaseStyle;
};

type OverviewData = {
  totalPurchaseCount: number;
  totalRevenue: number;
};

type AnalysisResponse = {
  overview: OverviewData;
  tests: TestData[];
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor: "#FFFFFF",
    padding: "40px",
    fontFamily: "'Arial', sans-serif",
    minHeight: "100vh",
    color: "#000000",
  },
  heading: {
    textAlign: "center",
    fontSize: "32px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  overview: {
    marginBottom: "30px",
    textAlign: "center",
  },
  overviewItem: {
    fontSize: "18px",
    marginBottom: "10px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  tableHeader: {
    border: "1px solid #dddddd",
    padding: "12px 8px",
    textAlign: "left",
    backgroundColor: "#f2f2f2",
    fontWeight: "bold",
  },
  tableCell: {
    border: "1px solid #dddddd",
    padding: "12px 8px",
    fontSize: "16px",
    textAlign: "left",
  },
  loading: {
    textAlign: "center",
    fontSize: "18px",
    marginTop: "20px",
  },
  error: {
    color: "red",
    textAlign: "center",
    fontSize: "18px",
    marginTop: "20px",
  },
  pageContainer: {
    display: "flex",
    height: "100vh",
  },
  sidebar: {
    width: "200px",
    backgroundColor: "#333",
    color: "#FFF",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  navButton: {
    backgroundColor: "#555",
    border: "none",
    padding: "10px",
    cursor: "pointer",
    color: "#FFF",
    borderRadius: "5px",
    textAlign: "left",
  },
  mainContent: {
    flex: 1,
    overflow: "auto",
  },
};

export default function AnalysisPage() {
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [tests, setTests] = useState<TestData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchAnalysis = async () => {
    try {
      const response = await fetch("/api/analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type: "PRICING" }),
      });

      if (response.ok) {
        const data: AnalysisResponse = await response.json();
        setOverview(data.overview);
        setTests(data.tests);
      } else {
        setError("Failed to fetch analysis data.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(`Error: ${err.message}`);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
  }, []);

  if (loading) return <p style={styles.loading}>Loading...</p>;
  if (error) return <p style={styles.error}>{error}</p>;

  return (
    <div style={styles.pageContainer}>
      {/* Sidebar Navigation */}
      <div style={styles.sidebar}>
        <button style={styles.navButton} onClick={() => router.push("/")}>
          Test Page
        </button>
        <button style={styles.navButton} onClick={() => router.push("/product")}>
          Product Page
        </button>
        <button style={styles.navButton} onClick={() => router.push("/analysis")}>
          Analysis Page
        </button>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <div style={styles.container}>
          <h1 style={styles.heading}>Analysis Results</h1>

          {overview && (
            <div style={styles.overview}>
              <p style={styles.overviewItem}>
                <strong>Total Purchase Count:</strong> {overview.totalPurchaseCount || "N/A"}
              </p>
              <p style={styles.overviewItem}>
                <strong>Total Revenue:</strong> ${overview.totalRevenue}
              </p>
            </div>
          )}

          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Test ID</th>
                <th style={styles.tableHeader}>Unit Price</th>
                <th style={styles.tableHeader}>Purchase Count</th>
                <th style={styles.tableHeader}>Mean Price</th>
                <th style={styles.tableHeader}>Revenue</th>
                <th style={styles.tableHeader}>Subscribe Count</th>
                <th style={styles.tableHeader}>One-Time Purchase Count</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((test) => (
                <tr key={test.testId}>
                  <td style={styles.tableCell}>{test.testId}</td>
                  <td style={styles.tableCell}>${test.unitPrice}</td>
                  <td style={styles.tableCell}>{test.purchaseCount}</td>
                  <td style={styles.tableCell}>${test.meanPrice}</td>
                  <td style={styles.tableCell}>${test.revenue}</td>
                  <td style={styles.tableCell}>{test.purchaseStyle["subscribe-and-save"] || 0}</td>
                  <td style={styles.tableCell}>{test.purchaseStyle["one-time-purchase"] || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
