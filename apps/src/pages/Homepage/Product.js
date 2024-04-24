import styles from "./Homepage.module.scss";
import "react-multi-carousel/lib/styles.css";

const Product = () => {
  const dataImg = [
    {
      id: 1,
      src: "/assets/image/product.jpg",
      alt: "Product 1",
      title: "Buket Bunga (M)",
    },
    {
      id: 2,
      src: "/assets/image/product2.jpg",
      alt: "Buket Snack (M)",
      title: "Buket Snack (M)",
    },
    {
      id: 3,
      src: "/assets/image/product3.jpg",
      alt: "Buket Uang (M)",
      title: "Buket Uang (M)",
    },
    {
      id: 4,
      src: "/assets/image/product.jpg",
      alt: "Hampers Premium",
      title: "Hampers Premium",
    },
    {
      id: 5,
      src: "/assets/image/product2.jpg",
      alt: "Buket Balon",
      title: "Buket Balon",
    },
    {
      id: 6,
      src: "/assets/image/product3.jpg",
      alt: "Buket Uang (XL)",
      title: "Buket Uang (XL)",
    },
  ];

  return (
    <div className={styles.product}>
      <p className={styles.productTitle}>Order Sekarang</p>
      <div className={styles.productContainer}>
        <div className={styles.productList}>
          {dataImg?.map((item) => (
            <div className={styles.productItem} key={item.id}>
              <img
                className={styles.productImage}
                src={item.src}
                alt={item.alt}
              />
              <div className={styles.productDesc}>
                <span className={styles.pdTitle}>{item.title}</span>
                <div className={styles.pdPrice}>
                  <span className={styles.pdDiscount}>Rp. 85.000</span>
                  <span className={styles.pdRaw}>Rp. 65.000</span>
                </div>
                <button
                  onClick={() => window.open("https://api.whatsapp.com/")}
                  className={styles.pdButton}
                >
                  Pesan Sekarang
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Product;
