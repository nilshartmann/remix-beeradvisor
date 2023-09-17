import styles from "./page.module.css";
import React, { Suspense } from "react";
import { Shop, ShopApiResponse } from "~/types";
import { defer, json, LoaderFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import { Await, Link, useLoaderData } from "@remix-run/react";
import LoadingIndicator from "~/components/LoadingIndicator";
import prisma from "~/lib/prisma";
type ShopResponse = ShopApiResponse<Shop>;

async function sleep() {
  return new Promise((res) => {
    setTimeout(() => res(null), 1200);
  });
}

async function loadShop(shopId: string) {
  const url = `http://localhost:7001/shops/${shopId}`;
  console.log("Fetching from ", url);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Loading beer ${shopId} failed with status code ${response.status}`,
    );
  }

  const data = (await response.json()) as ShopResponse;

  return data;
}

async function loadBeer(beerId: string) {
  const beer = await prisma.beer.findUnique({
    where: {
      id: beerId,
    },
    select: {
      id: true,
      name: true,
    },
  });

  // await sleep();
  return beer;
}

export async function loader({ params }: LoaderFunctionArgs) {
  const { shopId } = params;
  invariant(shopId);

  const shop = await loadShop(shopId);
  const beers = await Promise.all(shop.data.beers.map(loadBeer));

  return defer({
    shop,
    beers,
  });
}

type ShopPageProps = { params: { shopId: string } };
export default function ShopPage({ params }: ShopPageProps) {
  const {
    shop: { data: shop },
    beers,
  } = useLoaderData<typeof loader>();

  return (
    <div className={styles.ShopPage}>
      <div className={styles.DescriptionTitle}>
        <h1>{shop.name}</h1>
      </div>
      <div style={{ display: "flex" }}>
        <div style={{ marginRight: "50px" }}>
          <div className={styles.Title}>
            <h1>where to find</h1>
          </div>
          <div>
            <div className={styles.Address}>
              {shop.street}
              <br />
              {shop.postalcode} {shop.city}
              <br />
              {shop.country}
            </div>
          </div>
        </div>

        <div className={styles.Title}>
          <h1>what&apos;s in stock</h1>

          <div className={styles.Beers}>
            {beers.map((beer) => (
              <BeerInStock key={beer?.id || "null"} beer={beer} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

type BeerInStockProps = {
  beer: { id: string; name: string } | null;
};

function BeerInStock({ beer }: BeerInStockProps) {
  if (!beer) {
    return null;
  }

  return (
    <div className={styles.Beer}>
      <Link to={`/beers/${beer.id}`}>{beer.name}</Link>
    </div>
  );
}
