import { useEffect, useState, useRef } from "react";

export default function ProductPage() {
  const [productData, setProductData] = useState(null);
  const fetched = useRef(false);

  useEffect(() => {
    async function fetchProductData() {
      const res = await fetch("/api/product");
      const data = await res.json();
      setProductData(data.content);
    }
    if (!fetched.current) {
      fetchProductData();
      fetched.current = true;
    }
  }, []);

  if (!productData) return <p>Loading...</p>;

  return (
    <div style={styles.container}>
      {/* Customer Review Section */}
      <p style={styles.review}>⭐️⭐️⭐️⭐️⭐️ 25,000+ Happy Customers</p>

      {/* Product Title */}
      <h1 id="title" style={styles.title}>{productData.title}</h1>

      {/* Product Price */}
      <p id="price" style={styles.price}>{productData.price}</p>

      {/* Product Description */}
      <div id="description" style={styles.description}>
        {productData.description.map((line, index) => (
          <p key={index} style={styles.descriptionLine}>• {line}</p>
        ))}
      </div>

      {/* Product Features */}
      <div id="features" style={styles.features}>
        {productData.features.map((feature, index) => (
          <div key={index} style={styles.featureBox}>
            <img
              src={`/feature-icon-${index + 1}.png`} 
              alt={`Feature ${index + 1}`}
              style={styles.featureIcon}
            />
            <p style={styles.featureText}>{feature}</p>
          </div>
        ))}
      </div>

      {/* Purchase Options */}
      <div id="plans" style={styles.plans}>
        <div style={styles.planButtons}>
          <button style={styles.planButton}>One Time Purchase</button>
          <button style={styles.planButton}>Subscribe & Save 20%</button>
        </div>

        <div style={styles.planOptions}>
          {productData.plans.map((plan, index) => (
            <div key={index} style={styles.planBox}>
              <h3 style={styles.planSize}>{plan.size}</h3>
              <p style={styles.planPrice}>{plan.price}</p>
              <p style={styles.planUnit}>{plan.perUnit}</p>
              <p style={styles.discount}>{plan.discount}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={styles.planButtons}>
          <button style={styles.planButton} onClick={() => {
            fetch("/api/reset");
          }}>Reset cookie</button>
        </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#FFF5CC",
    padding: "40px",
    fontFamily: "Arial, sans-serif",
    maxWidth: "800px",
    margin: "0 auto",
  },
  review: {
    color: "#FFC107",
    fontWeight: "bold",
    marginBottom: "10px",
    fontSize: "18px",
  },
  title: {
    fontSize: "42px",
    fontWeight: "bold",
    marginBottom: "5px",
    color: "#000", // Black text
  },
  price: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#000", // Black text
    marginBottom: "20px",
  },
  description: {
    backgroundColor: "#FFF",
    padding: "20px",
    borderRadius: "8px",
    marginBottom: "30px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  descriptionLine: {
    marginBottom: "8px",
    fontSize: "18px",
    color: "#000", // Black text
  },
  features: {
    display: "flex",
    justifyContent: "space-around",
    marginBottom: "30px",
  },
  featureBox: {
    textAlign: "center",
    padding: "10px",
  },
  featureIcon: {
    width: "40px",
    marginBottom: "8px",
    textAlign: "center",
    marginLeft: "auto",
    marginRight: "auto",
  },
  featureText: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#000", // Black text
  },
  plans: {
    backgroundColor: "#FFE680",
    padding: "30px",
    borderRadius: "8px",
    
  },
  planButtons: {
    display: "flex",
    justifyContent: "center", // Center buttons
    gap: "10px", // Spacing between buttons
    marginBottom: "20px",
  },
  planButton: {
    backgroundColor: "#FFF",
    border: "none",
    padding: "10px 20px",
    cursor: "pointer",
    borderRadius: "5px",
    fontWeight: "bold",
    fontSize: "16px",
    minWidth: "200px", // Ensure consistent button width
    color: "#000", // Black text for buttons
  },
  planOptions: {
    display: "flex",
    justifyContent: "space-around",
  },
  planBox: {
    backgroundColor: "#FFF",
    padding: "20px",
    borderRadius: "8px",
    textAlign: "center",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  planSize: {
    fontSize: "18px",
    color: "#000", // Black text
  },
  planPrice: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#000", // Black text
  },
  planUnit: {
    fontSize: "14px",
    color: "#808080", // Gray text for per unit price
  },
  discount: {
    color: "#FFA500", // Black text for discount
    fontWeight: "bold",
  },
};
