"use client";

import Image from "next/image";
import styles from "./place-card.module.css";

// Define the interface for a single place
interface Place {
  imageUrl: string;
  title: string;
  district: string;
}

// Fixed PlaceCard component
export const PlaceCard = ({ place }: { place: Place }) => {
  return (
    <div className={styles["place-card"]}>
      <div className={styles["img-container"]}>
        <Image src={place.imageUrl} alt={place.title} fill />
      </div>
      <div>
        <p>
          <strong>Title:</strong> <span>{place.title}</span>
        </p>
        <p>
          <strong>District:</strong> <span>{place.district}</span>
        </p>
      </div>
    </div>
  );
};
