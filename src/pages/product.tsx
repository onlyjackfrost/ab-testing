import { useEffect, useState, useRef } from "react";
import Image from "next/image";

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
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(0); // Track the selected plan
  const fetched = useRef(false);

  const handlePurchaseEvent = async (plan: { size: string; price: number }, purchaseType: string) => {
    try {
      const response = await fetch("/api/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "purchase",
          properties: { 
            price: plan.price, 
            size: plan.size, 
            purchaseType,
          },
        }),
        credentials: 'include', // Ensure cookies are included
      });
  
      if (response.ok) {
        console.log("Event sent successfully.");
      } else {
        console.error("Failed to send event.");
      }
    } catch (error) {
      console.error("Error sending event:", error);
    }
  };
  
  const handleOneTimePurchase = () => {
    const plan = productData?.plans[selectedPlanIndex];
    if (!plan) return; // Guard clause for safety
    handlePurchaseEvent({ price: plan.price, size: plan.size }, "one-time-purchase");
  };

  const handleSubscribeAndSave = () => {
    const plan = productData?.plans[selectedPlanIndex];
    const price = plan?.price;
    const planSize = plan?.size;
    if (plan) {
      console.log("Subscribe and save");
      handlePurchaseEvent({ price: price!, size: planSize! }, "subscribe-and-save");
    }
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
                backgroundColor: index === selectedPlanIndex ? "#ADD8E6" : "#FFF", // Blue background for selected plan
                cursor: 'pointer'
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
          style={styles.planButton}
          onClick={() => {
            fetch("/api/reset");
            window.location.reload();
          }}
        >
          Reset cookie & reload
        </button>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
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
    color: "#000",
  },
  price: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#000",
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
    color: "#000",
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
    marginBottom: "8px",
  },
  featureText: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#000",
  },
  plans: {
    backgroundColor: "#FFE680",
    padding: "30px",
    borderRadius: "8px",
  },
  planButtons: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
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
    minWidth: "200px",
    color: "#000",
  },
  planOptions: {
    display: "flex",
    justifyContent: "space-around",
  },
  planBox: {
    padding: "20px",
    borderRadius: "8px",
    textAlign: "center",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    transition: "background-color 0.3s, transform 0.2s", // Smooth transitions
  },
  planSize: {
    fontSize: "18px",
    color: "#000",
  },
  planPrice: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#000",
  },
  planUnit: {
    fontSize: "14px",
    color: "#808080",
  },
  discount: {
    color: "#FFA500",
    fontWeight: "bold",
  },
};
