// import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import styles from "./Header.module.scss";
import Image from "../Image/Image";
import Hamburger from "../Hamburger/Hamburger";

const Header = () => {
  return (
    <nav className={styles.navWrapper}>
      <div className={styles.navIcon}>
        <Image
          className={styles.testImage}
          src="/assets/icon-tasiaga.svg"
          fallback="/assets/sample.jpg"
          alt="This is a sample image"
        />
      </div>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <Link to="/">Beranda</Link>
        </li>
        <li className={styles.navItem}>
          <Link to="/test-router">Momen</Link>
        </li>
        <li className={styles.navItem}>
          <Link to="/test-router">Produk</Link>
        </li>
      </ul>

      <div className={styles.navIconText}>
        <span>Tasiaga Bouquet</span>
      </div>

      <div className={styles.navBurger}>
        <Hamburger checked={false} onClick={() => console.log("ADAKH")} />
      </div>
      <div className={styles.navForm}>
        <input type="text" />
        <span>Cari sesuatu</span>
      </div>
    </nav>
  );
};

// Header.propTypes = {
//   className: PropTypes.string,
//   src: PropTypes.string.isRequired,
//   fallback: PropTypes.string.isRequired,
//   alt: PropTypes.string.isRequired,
// };

export default Header;
