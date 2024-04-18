import Header from "../../components/Header/Header";
import Image from "../../components/Image/Image";
import styles from "./Homepage.module.scss";

const Test = () => {
  return (
    <div className="">
      <Header />
      <div className={styles.testImageContainer}>
        <Image
          className={styles.testImage}
          src="/assets/sample.webp"
          fallback="/assets/sample.jpg"
          alt="This is a sample image"
        />
      </div>
    </div>
  );
};

export default Test;
