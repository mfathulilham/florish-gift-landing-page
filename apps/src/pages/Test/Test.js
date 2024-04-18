import Image from "../../components/Image/Image";
import styles from "./Test.module.scss";

const Test = () => {
  return (
    <div className={styles.testContainer}>
      <div className={styles.testImageContainer}>
        <Image
          className={styles.testImage}
          src="/assets/sample.webp"
          fallback="/assets/sample.jpg"
          alt="This is a sample image"
        />
      </div>
      Testing 123
    </div>
  );
};

export default Test;
