import Image from "../../components/Image/Image";
import styles from "./Homepage.module.scss";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const Home = () => {
  return (
    <div className={styles.testImageContainer}>
      <Carousel
        additionalTransfrom={0}
        arrows
        autoPlay
        autoPlaySpeed={3000}
        centerMode={false}
        className=""
        containerClass="container"
        dotListClass=""
        draggable
        focusOnSelect={false}
        infinite
        itemClass=""
        keyBoardControl
        minimumTouchDrag={80}
        pauseOnHover
        renderArrowsWhenDisabled={false}
        renderButtonGroupOutside={false}
        renderDotsOutside={false}
        responsive={{
          desktop: {
            breakpoint: {
              max: 3000,
              min: 1024,
            },
            items: 1,
          },
          mobile: {
            breakpoint: {
              max: 464,
              min: 0,
            },
            items: 1,
          },
          tablet: {
            breakpoint: {
              max: 1024,
              min: 464,
            },
            items: 1,
          },
        }}
        rewind={false}
        rewindWithAnimation={false}
        rtl={false}
        shouldResetAutoplay
        showDots
        sliderClass=""
        slidesToSlide={1}
        swipeable
      >
        <Image
          className={styles.testImage}
          src="/assets/image/banner1.jpg"
          fallback="/assets/banner1.jpg"
          alt="This is a sample image"
        />
        <Image
          className={styles.testImage}
          src="/assets/image/banner2.jpg"
          fallback="/assets/banner2.jpg"
          alt="This is a sample image"
        />
        <Image
          className={styles.testImage}
          src="/assets/image/banner3.jpg"
          fallback="/assets/banner3.jpg"
          alt="This is a sample image"
        />
      </Carousel>
    </div>
  );
};

export default Home;
