import styles from "./_index.module.css";
import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
export const meta: MetaFunction = () => {
  return [
    { title: "BeerAdvisor" },
    { name: "description", content: "Enjoy and advice!" },
  ];
};

export default function Index() {
  return (
    <div className={styles.Welcome}>
      <h1>Welcome!</h1>

      <p>
        Before you enter, please confirm that you are old enough to drink beer?
      </p>

      <Link to={"/beers"}>Yes, I am</Link>
    </div>
  );
}
