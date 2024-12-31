import { Carousel } from "antd";
import Image from "next/image";
import Img1 from "../../asset/slidshow/01.jpeg";
import Img2 from "../../asset/slidshow/02.jpg";
import Img3 from "../../asset/slidshow/03.jpg";
import Img4 from "../../asset/slidshow/04.jpg";
import Img5 from "../../asset/slidshow/05.jpg";
import Img6 from "../../asset/slidshow/06.jpg"
import styles from "./slide-show.module.css";

export const SlideShow = () => {
  return (
    <Carousel autoplay autoplaySpeed={3000}>
      <div className={styles["carousel-container"]}>
        <Image src={Img1} alt="image1" className={styles["carousel-image"]} />
      </div>
      <div className={styles["carousel-container"]}>
        <Image src={Img2} alt="image2" className={styles["carousel-image"]} />
      </div>
      <div className={styles["carousel-container"]}>
        <Image src={Img3} alt="image3" className={styles["carousel-image"]} />
      </div>
      <div className={styles["carousel-container"]}>
        <Image src={Img4} alt="image4" className={styles["carousel-image"]} />
      </div>
      <div className={styles["carousel-container"]}>
        <Image src={Img5} alt="image5" className={styles["carousel-image"]} />
      </div>
      <div className={styles["carousel-container"]}>
        <Image src={Img6} alt="image6" className={styles["carousel-image"]} />
      </div>
    </Carousel>
  );
};
