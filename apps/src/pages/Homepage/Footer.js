import styles from "./Homepage.module.scss";
import "react-multi-carousel/lib/styles.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p className={styles.footerTitle}>Buket Tasiaga</p>
      <ul className={styles.footerContainer}>
        <li>
          <a href="https://api.whatsapp.com/" target="blank">
            Hubungi Kami
          </a>
        </li>
        <li>
          <a href="https://api.whatsapp.com/" target="blank">
            Alamat Kami
          </a>
        </li>
        <li>
          <a href="https://api.whatsapp.com/" target="blank">
            Tentang Kami
          </a>
        </li>
      </ul>
    </footer>
  );
};

export default Footer;
