import DistrictMap from "@/components/slmap/district-map";
import styles from "./page.module.css";
import { PlaceCard } from "@/components/place-card/place-card";
import im1 from "../../asset/slidshow/01.jpeg";
import im2 from "../../asset/slidshow/02.jpg";
import im3 from "../../asset/slidshow/03.jpg";

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
        {places.map((place) => (
          <PlaceCard key={place.id} place={place} />
        ))}
      </div>
    </>
  );
};

export default Home;
