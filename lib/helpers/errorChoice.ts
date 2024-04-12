import { AnyAction, Dispatch } from "redux";
import { setInteractError } from "../../redux/reducers/interactErrorSlice";
import { setIndexer } from "../../redux/reducers/indexerSlice";
import { TFunction } from "i18next";

const errorChoice = async (
  err: any,
  runner: (() => Promise<void>) | (() => void),
  dispatch: Dispatch<AnyAction>,
  t: TFunction<"404", undefined>
) => {
  if (err?.message?.includes("User rejected the request")) return;
  if (
    !err?.messages?.includes("Block at number") &&
    !err?.message?.includes("could not be found")
  ) {
    dispatch(setInteractError(true));
    console.error(err.message);
  } else {
    dispatch(
      setIndexer({
        actionOpen: true,
        actionMessage: t("suc"),
      })
    );

    if (runner() instanceof Promise) {
      await runner();
    } else {
      runner();
    }

    setTimeout(() => {
      dispatch(
        setIndexer({
          actionOpen: false,
          actionMessage: undefined,
        })
      );
    }, 3000);
  }
};

export default errorChoice;
