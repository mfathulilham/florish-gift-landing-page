import styles from "./Homepage.module.scss";
import "react-multi-carousel/lib/styles.css";

const Product = () => {
  const dataImg = [
    {
      id: 1,
      src: "/assets/image/product.jpg",
      alt: "Product 1",
      title: "Ulang Tahun",
    },
    {
      id: 2,
      src: "/assets/image/product2.jpg",
      alt: "Product 2",
      title: "Wisuda",
    },
    {
      id: 3,
      src: "/assets/image/product3.jpg",
      alt: "Product 3",
      title: "Anniversary",
    },
    {
      id: 4,
      src: "/assets/image/product.jpg",
      alt: "Product 4",
      title: "Pernikahan",
    },
    {
      id: 5,
      src: "/assets/image/product2.jpg",
      alt: "Product 5",
      title: "Hampers",
    },
    {
      id: 6,
      src: "/assets/image/product3.jpg",
      alt: "Product 6",
      title: "Hampers",
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
              <span className={styles.productDesc}>{item.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Product;
