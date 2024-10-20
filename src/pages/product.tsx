import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

type ProductData = {
  title: string;
  price: string;
  description: string[];
  features: string[];
  plans: {
    size: string;
    price: number;
    perUnit: string;
    discount: string;
  }[];
};

export default function ProductPage() {
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(0);
  const fetched = useRef(false);
  const router = useRouter(); // Router hook to navigate between pages

  const handlePurchaseEvent = async (plan: { size: string; price: number }, purchaseType: string) => {
    try {
      await fetch("/api/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "purchase",
          properties: { price: plan.price, size: plan.size, purchaseType },
        }),
        credentials: "include",
      });

    } catch (error) {
      console.error("Error sending event:", error);
    }
  };

  const handleOneTimePurchase = () => {
    const plan = productData?.plans[selectedPlanIndex];
    if (!plan) return;
    handlePurchaseEvent(plan, "one-time-purchase");
  };

  const handleSubscribeAndSave = () => {
    const plan = productData?.plans[selectedPlanIndex];
    if (!plan) return;
    handlePurchaseEvent(plan, "subscribe-and-save");
  };

  useEffect(() => {
    async function fetchProductData() {
      const res = await fetch("/api/product");
      const data = await res.json();
      const price = data.content.price;

      const content: ProductData = {
        title: "Chebe Hair Butter",
        price: `$${price}`,
        description: [
          "Perfect for hair moisturization, strength, growth",
          "Prevents split ends, breakage, dry hair",
          "Zero-water formula means your hair can absorb full benefits of organic, natural ingredients",
          "100% natural chebe powder extract from Africa",
          "Used by women from Africa for hair length and retention for centuries",
        ],
        features: [
          "Powerful Moisturization",
          "Prevent breakage and split ends",
          "Strengthen & lengthen hair",
        ],
        plans: [
          { size: "8 oz", price: price * 1.7, perUnit: `$${(price * 1.7 / 8).toFixed(2)} per oz`, discount: "Save 30%" },
          { size: "4 oz", price: price, perUnit: `$${(price / 4).toFixed(2)} per oz`, discount: "" },
        ],
      };

      setProductData(content);
    }

    if (!fetched.current) {
      fetchProductData();
      fetched.current = true;
    }
  }, []);

  if (!productData) return <p>Loading...</p>;

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
      <div style={styles.container}>
        <p style={styles.review}>⭐️⭐️⭐️⭐️⭐️ 25,000+ Happy Customers</p>
        <h1 id="title" style={styles.title}>{productData.title}</h1>
        <p id="price" style={styles.price}>{productData.price}</p>

        <div id="description" style={styles.description}>
          {productData.description.map((line, index) => (
            <p key={index} style={styles.descriptionLine}>• {line}</p>
          ))}
        </div>

        <div id="features" style={styles.features}>
          {productData.features.map((feature, index) => (
            <div key={index} style={styles.featureBox}>
              <Image
                src={`/feature-icon-${index + 1}.png`}
                alt={`Feature ${index + 1}`}
                width={40}
                height={40}
                style={styles.featureIcon}
              />
              <p style={styles.featureText}>{feature}</p>
            </div>
          ))}
        </div>

        <div id="plans" style={styles.plans}>
          <div style={styles.planOptions}>
            {productData.plans.map((plan, index) => (
              <div
                key={index}
                onClick={() => setSelectedPlanIndex(index)}
                style={{
                  ...styles.planBox,
                  backgroundColor: index === selectedPlanIndex ? "#ADD8E6" : "#FFF",
                  cursor: "pointer",
                }}
              >
                <h3 style={styles.planSize}>{plan.size}</h3>
                <p style={styles.planPrice}>${plan.price.toFixed(2)}</p>
                <p style={styles.planUnit}>{plan.perUnit}</p>
                <p style={styles.discount}>{plan.discount}</p>
              </div>
            ))}
          </div>

          <div style={styles.planButtons}>
            <button style={styles.planButton} onClick={handleOneTimePurchase}>
              One Time Purchase
            </button>
            <button style={styles.planButton} onClick={handleSubscribeAndSave}>
              Subscribe & Save 20%
            </button>
          </div>
        </div>

        <div style={styles.planButtons}>
          <button
            style={styles.resetButton}
            onClick={() => {
              fetch("/api/reset");
              window.location.reload();
            }}
          >
            Reset cookie & reload
          </button>
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
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
  container: {
    backgroundColor: "#FFF5E1", // Light beige background
    padding: "40px",
    fontFamily: "Arial, sans-serif",
    maxWidth: "900px",
    margin: "40px auto",
    borderRadius: "12px", // Soft border radius for a modern look
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Soft shadow for depth
    color: "#000",
  },
  review: {
    color: "#FFC107",
    fontWeight: "bold",
    marginBottom: "10px",
    fontSize: "18px",
    textAlign: "center", // Center align
  },
  title: {
    fontSize: "36px", // Slightly smaller for better fit
    fontWeight: "bold",
    marginBottom: "10px",
    textAlign: "center", // Align center
  },
  price: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#4CAF50", // Greenish color to emphasize price
    marginBottom: "15px",
    textAlign: "center",
  },
  description: {
    backgroundColor: "#FFF",
    padding: "20px",
    borderRadius: "8px",
    marginBottom: "30px",
    border: "1px solid #ddd", // Light border to separate sections
    textAlign: "left", // Align text to left for readability
    fontSize: "16px",
  },
  descriptionLine: {
    marginBottom: "8px",
  },
  features: {
    display: "flex",
    justifyContent: "space-around",
    marginBottom: "30px",
    padding: "10px 0",
    borderTop: "1px solid #ddd", // Divider between sections
    borderBottom: "1px solid #ddd",
  },
  featureBox: {
    textAlign: "center",
    width: "30%", // Equal width for each feature
  },
  plans: {
    backgroundColor: "#FFE680",
    padding: "30px",
    borderRadius: "8px",
    marginBottom: "20px",
  },
  planOptions: {
    display: "flex",
    justifyContent: "space-around",
    marginBottom: "15px",
  },
  planBox: {
    padding: "15px",
    borderRadius: "8px",
    textAlign: "center",
    border: "1px solid #ddd", // Light border for plans
    backgroundColor: "#FFF",
    cursor: "pointer",
    transition: "background-color 0.3s", // Smooth transition for hover effect
  },
  planSize: {
    fontSize: "20px",
    fontWeight: "bold",
  },
  planPrice: {
    fontSize: "24px",
    color: "#4CAF50", // Green color for pricing emphasis
  },
  planUnit: {
    fontSize: "16px",
    color: "#888", // Subtle gray for per unit text
  },
  discount: {
    fontSize: "14px",
    color: "#FF5722", // Highlight discounts in orange
    fontWeight: "bold",
  },
  planButtons: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginTop: "10px",
  },
  planButton: {
    backgroundColor: "#3170d6",
    color: "#FFF",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background-color 0.3s", // Smooth transition for hover effect
  },
  resetButton: {
    backgroundColor: "#40b363",
    color: "#FFF",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
  }
};
