import { useRef, useEffect } from "react";
import styles from "./Form.module.css";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { action } from "~/routes/beers.$beerId._index/route";

type RatingFormProps = {
  beerName: string;
  beerId: string;
};

export default function RatingForm({ beerName }: RatingFormProps) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const navigation = useNavigation();
  const data = useActionData<typeof action>();
  const errors = data?.result === "error" ? data.errors : undefined;
  console.log("DATA", data);

  useEffect(() => {
    if (data?.result === "success" && formRef.current) {
      formRef.current?.reset();
    }
  }, [data?.result]);

  const error = "";

  return (
    <div className={styles.Form}>
      <Form method={"POST"} ref={formRef}>
        <fieldset>
          <div>
            <label>Your name:</label> <input type="text" name={"username"} />
          </div>
          {errors?.username && (
            <p className={styles.error}>{errors.username}</p>
          )}
          <div>
            <label>Your rating (1-5):</label>{" "}
            <input type="number" min="1" max="5" name={"stars"} />
          </div>
          {errors?.stars && <p className={styles.error}>{errors.stars}</p>}
          <div>
            <label>Your comment:</label> <input type="text" name={"comment"} />
          </div>
          {errors?.comment && <p className={styles.error}>{errors.comment}</p>}
          <div>
            <button
              disabled={navigation.state === "submitting"}
              type={"submit"}
            >
              Leave rating for {beerName}
            </button>
          </div>
          {navigation.state === "submitting" && <p>Saving...</p>}

          {error && (
            <div>
              <b>Could not add rating:</b> {error}
            </div>
          )}
        </fieldset>
      </Form>
    </div>
  );
}
