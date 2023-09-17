import styles from "./_index.module.css";
import prisma from "~/lib/prisma";
import ButtonBar from "~/components/ButtonBar";
import OrderByButton from "~/routes/beers._index/OrderByButton";
import { Link, useLoaderData } from "@remix-run/react";
import Stars from "~/components/Stars";
import { json, LoaderFunctionArgs } from "@remix-run/node";

function calcAverageStars(stars: { stars: number }[]) {
  const sum = stars.map((s) => s.stars).reduce((a, b) => a + b, 0);
  const avg = sum / stars.length || 0;
  return avg;
}

export async function loader({ request }: LoaderFunctionArgs) {
  // parse the search params for `?q=`
  const url = new URL(request.url);
  const orderBy = url.searchParams.get("order_by") || "name_asc";
  console.log("PARAMS", orderBy);

  const beers = await prisma.beer.findMany({
    select: {
      id: true,
      name: true,
      ratings: {
        select: {
          stars: true,
        },
      },
    },
    orderBy: {
      name: orderBy === "name_asc" ? "asc" : "desc",
    },
  });

  return json(beers);
}

export default function BeerListPage() {
  const beers = useLoaderData<typeof loader>();

  return (
    <>
      <ButtonBar>
        <OrderByButton orderBy={"name_asc"} />
        <OrderByButton orderBy={"name_desc"} />
      </ButtonBar>
      <div className={styles.BeerOverview}>
        {beers.map((beer) => (
          <BeerImage
            key={beer.id}
            name={beer.name}
            stars={calcAverageStars(beer.ratings)}
            imgUrl={`/assets/beer/${beer.id}-256x256-thumb.jpg`}
            href={`/beers/${beer.id}`}
          />
        ))}
      </div>
    </>
  );
}

type BeerImageProps = {
  imgUrl: string;
  name: string;
  stars: number;
  active?: boolean;
  href: string;
};

function BeerImage({ imgUrl, name, stars, href }: BeerImageProps) {
  return (
    <div className={styles.BeerImage}>
      <Link to={href}>
        <img alt={name} src={imgUrl} />
        <span className={styles.Label}>
          <h1>{name}</h1>
          <Stars stars={stars} />
        </span>
      </Link>
    </div>
  );
}
