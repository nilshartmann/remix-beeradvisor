import React from "react";
import styles from "./_index.module.css";
import { SingleBeer } from "~/routes/beers.$beerId._index/route";
import Rating from "~/routes/beers.$beerId._index/Rating";

type RatingListProps = {
  beer: SingleBeer;
};

export default function RatingList({ beer }: RatingListProps) {
  return (
    <div className={styles.Ratings}>
      <h1>What customers say:</h1>
      {beer.ratings.map((rating) => (
        <Rating key={rating.id} rating={rating} />
      ))}
    </div>
  );
}
