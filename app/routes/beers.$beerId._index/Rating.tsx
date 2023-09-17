import * as React from "react";
import styles from "./_index.module.css";
import Stars from "~/components/Stars";
import { SingleBeer } from "~/routes/beers.$beerId._index/route";

type RatingProps = {
  rating: SingleBeer["ratings"][0];
};

const Rating = ({ rating: { username, comment, stars } }: RatingProps) => (
  <div className={styles.Rating}>
    <span className={styles.Author}>{username}</span>:{" "}
    <span className={styles.Comment}>
      „{comment}“ <Stars stars={stars} />
    </span>
  </div>
);

export default Rating;
