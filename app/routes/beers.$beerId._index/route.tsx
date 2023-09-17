import type { AddRatingRequestBody, Shop, ShopApiResponse } from "~/types";
import styles from "./_index.module.css";
import { Fragment, Suspense } from "react";
import LoadingIndicator from "~/components/LoadingIndicator";
import prisma from "~/lib/prisma";
import {
  ActionFunctionArgs,
  defer,
  json,
  LoaderFunctionArgs,
} from "@remix-run/node";
import invariant from "tiny-invariant";
import { Await, Link, useAsyncValue, useLoaderData } from "@remix-run/react";
import RatingForm from "~/routes/beers.$beerId._index/AddRatingForm";
import RatingList from "~/routes/beers.$beerId._index/RatingList";
import { v4 as uuid } from "uuid";

type ShopsReponse = ShopApiResponse<Shop[]>;

async function loadBeer(beerId: string) {
  const beer = await prisma.beer.findUnique({
    where: {
      id: beerId,
    },
    include: {
      ratings: true,
    },
  });
  return beer;
}

export type SingleBeer = NonNullable<Awaited<ReturnType<typeof loadBeer>>>;

async function loadShops(beerId: string) {
  const url = `http://localhost:7001/shops?beerId=${beerId}`;
  console.log("Fetching from ", url);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Loading beer ${beerId} failed with status code ${response.status}`,
    );
  }

  await sleep();

  return response.json() as Promise<ShopsReponse>;
}

export async function loader({ params }: LoaderFunctionArgs) {
  const { beerId } = params;
  invariant(beerId, "beerId param missing");

  const shopsPromise = loadShops(beerId);
  const beer = await loadBeer(beerId);

  return defer({ shopsPromise, beer });
}

function getFormString(formData: FormData, n: string): string {
  const value = formData.get(n);
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  return ""; // 🙄
}

async function sleep() {
  return new Promise((res) => {
    setTimeout(() => res(null), 1200);
  });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { beerId } = params;
  invariant(beerId, "beerId param missing");
  const formData = await request.formData();

  const username: string = getFormString(formData, "username");
  const stars = parseInt(getFormString(formData, "stars") || "0");
  const comment: string = getFormString(formData, "comment");

  const errors: Record<string, string> = {};
  if (username.length < 3)
    errors.username = "Username must be at least 3 chars";
  if (stars < 1 || stars > 5) errors.stars = "Stars must be between 1 and 5";
  if (comment.length < 5) errors.comment = "Comment must be at lease 5 chars";

  if (Object.keys(errors).length) {
    return json({
      result: "error",
      errors,
      data: { username, stars, comment },
    } as const);
  }

  const id = uuid();
  await prisma.rating.create({
    data: {
      id,
      beerId,
      username,
      stars,
      comment,
    },
  });

  // await sleep();

  return json({
    result: "success",
  } as const);
}

export default function BeerPage() {
  const { shopsPromise, beer } = useLoaderData<typeof loader>();
  if (!beer) {
    return <h1>Beer Not found</h1>;
  }

  return (
    <div>
      <div className={styles.Beer}>
        <div className={styles.DescriptionTitle}>
          <h1>{beer.name}</h1>
          <h3>{beer.price}</h3>
        </div>
        <div className={styles.Description}>
          <div className={styles.Img}>
            <img alt={beer.name} src={`/assets/beer/${beer.id}.jpg`} />
          </div>
          <div>
            <h1>Where to buy:</h1>

            <Suspense
              fallback={
                <div style={{ marginBottom: "1.5rem" }}>
                  <LoadingIndicator secondary />
                </div>
              }
            >
              <Await resolve={shopsPromise}>
                <Shops />
              </Await>
            </Suspense>

            <RatingList beer={beer} />

            <h1>
              ...and what do <em>you</em> think?
            </h1>
            <RatingForm beerId={beer.id} beerName={beer.name} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Shops() {
  const shops = useAsyncValue() as ShopsReponse;
  return (
    <div className={styles.Shops}>
      {shops.data.map((shop, ix) => (
        <Fragment key={shop.id}>
          <div className={styles.Shop}>
            <Link to={`/shop/${shop.id}`}>
              <span className={styles.Name}>{shop.name}</span>
            </Link>
          </div>
          {ix < shops.data.length - 1 ? " | " : null}
        </Fragment>
      ))}
    </div>
  );
}
