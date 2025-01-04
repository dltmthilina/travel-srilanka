import DistrictMap from "@/components/slmap/district-map";
import styles from "./page.module.css";
import { PlaceCard } from "@/components/place-card/place-card";
import im1 from "../../asset/slidshow/01.jpeg";
import im2 from "../../asset/slidshow/02.jpg";
import im3 from "../../asset/slidshow/03.jpg";
import { Col, Row } from "antd";

const places = [
  {
    id: 1,
    imageUrl: im1.src,
    title: "sigiriya",
    district: "Matale",
  },
  {
    id: 2,
    imageUrl: im2.src,
    title: "Bopath fall",
    district: "Rathnapura",
  },
  {
    id: 3,
    imageUrl: im3.src,
    title: "Small dabbadiwa",
    district: "Rathnapura",
  },
];

const Home = () => {
  return (
    <>
      <div className={styles["map-container"]}>
        <DistrictMap />
      </div>
      <div className={styles["newly-added"]}>
        <Row gutter={[8, 8]} justify="start">
          {places.map((item) => (
            <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
              <PlaceCard key={item.id} place={item} />
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
};

export default Home;
