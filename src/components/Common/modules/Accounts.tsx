import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import Image from "next/legacy/image";
import { AiOutlineLoading } from "react-icons/ai";
import { AccountsProps } from "../types/common.types";
import createProfilePicture from "../../../../lib/helpers/createProfilePicture";
import { setFiltersOpen } from "../../../../redux/reducers/filtersOpenSlice";
import { setPostBox } from "../../../../redux/reducers/postBoxSlice";
import { setFullScreenVideo } from "../../../../redux/reducers/fullScreenVideoSlice";
import handleImageError from "../../../../lib/helpers/handleImageError";
import CartList from "./CartList";
import {
  PiArrowFatLinesLeftFill,
  PiArrowFatLinesRightFill,
} from "react-icons/pi";

const Accounts: FunctionComponent<AccountsProps> = ({
  searchActive,
  filtersOpen,
  lensConnected,
  walletConnected,
  handleLensConnect,
  openConnectModal,
  setOpenAccount,
  cartItems,
  openAccount,
  cartListOpen,
  signInLoading,
  setCartListOpen,
  router,
  handleLogout,
  dispatch,
  auto,
  cartAnim,
  fullScreenVideo,
  t,
  setLocale,
  locale
}): JSX.Element => {
  const profilePicture = createProfilePicture(lensConnected?.metadata?.picture);
  return (
    <>
      <div
        className={`w-full pre:w-fit h-fit pre:h-10 flex flex-col pre:flex-row gap-4 items-center justify-center ${
          (searchActive || filtersOpen) &&
          !auto &&
          typeof window !== "undefined" &&
          window.innerWidth < 1024
            ? "relative pre:absolute pre:top-2 pre:right-2 lg:top-auto lg:right-auto lg:relative"
            : "relative"
        }`}
      >
        <div className="relative w-fit h-fit flex items-center justify-center text-sol flex-col text-center font-vcr uppercase">
          <div className="relative w-fit h-fit flex items-center justify-center flex-row gap-2">
            <div
              className="relative flex items-center justify-center w-fit h-fit active:scale-95 cursor-pointer"
              onClick={() => {
                if (locale == "en") {
                  setLocale("es");
                  router.push(router.asPath, undefined, {
                    locale: "es",
                  });
                } else {
                  setLocale("en");
                  router.push(router.asPath, undefined, {
                    locale: "en",
                  });
                }
              }}
            >
              <PiArrowFatLinesLeftFill size={15} />
            </div>
            <div className="relative w-fit h-fit flex items-center justify-center">
              <div className="relative w-8 h-10 flex items-center justify-center">
                <Image
                  layout="fill"
                  src={`${INFURA_GATEWAY}/ipfs/${
                    locale == "es"
                      ? "QmY43U5RovVkoGrkLiFyA2VPMnGxf5e3NgYZ95u9aNJdem"
                      : "QmXdyvCYjZ7FkPjgFX5BPi98WTpPdJT5FHhzhtbyzkJuNs"
                  }`}
                  draggable={false}
                />
              </div>
            </div>
            <div
              className="relative flex items-center justify-center w-fit h-fit active:scale-95 cursor-pointer"
              onClick={() => {
                if (locale == "en") {
                  setLocale("es");
                  router.push(router.asPath, undefined, {
                    locale: "es",
                  });
                } else {
                  setLocale("en");
                  router.push(router.asPath, undefined, {
                    locale: "en",
                  });
                }
              }}
            >
              <PiArrowFatLinesRightFill size={15} />
            </div>
          </div>
        </div>

        {!lensConnected && (
          <div
            className={`w-24 h-8 relative flex items-center justify-center p-px rounded-sm text-center cursor-pointer active:scale-95 hover:opacity-70`}
            id="borderSearch"
            onClick={
              !walletConnected
                ? openConnectModal
                : walletConnected && !lensConnected
                ? () => handleLensConnect()
                : () => {}
            }
          >
            <div
              className={`relative w-full h-full rounded-sm font-vcr flex items-center justify-center text-sm bg-offBlack text-sol`}
            >
              <div
                className={`relative w-fit h-fit flex items-center justify-center ${
                  signInLoading && "animate-spin"
                }`}
              >
                {signInLoading ? (
                  <AiOutlineLoading size={15} color={"white"} />
                ) : !walletConnected ? (
                  t("con")
                ) : (
                  walletConnected && !lensConnected && t("len")
                )}
              </div>
            </div>
          </div>
        )}
        <div
          className="relative w-8 h-8 pre:h-4/5 flex items-center justify-center cursor-pointer active:scale-95"
          id={cartAnim ? "cartAnim" : ""}
          title="Cart"
          onClick={() => {
            setOpenAccount(false);
            setCartListOpen(!cartListOpen);
          }}
        >
          <Image
            src={`${INFURA_GATEWAY}/ipfs/QmT5ewiqFhfo8EHxSYiFwFR67pBpg7xesdtwAu9oWBoqqu`}
            layout="fill"
            draggable={false}
          />
        </div>
        {cartItems?.length > 0 && (
          <div
            className={`absolute rounded-full border border-mar bg-black w-5 flex items-center justify-center pre:top-auto top-32 pre:-bottom-1 h-5 p-1 font-vcr text-mar text-xxs z-1 pre:left-auto ${
              lensConnected?.id ? "pre:right-[8.5rem]" : "pre:right-[5.5rem]"
            }`}
          >
            {cartItems?.length}
          </div>
        )}

        <div
          className="relative w-8 h-8 pre:h-4/5 flex items-center justify-center cursor-pointer active:scale-95"
          onClick={() =>
            dispatch(
              setFullScreenVideo({
                actionOpen: fullScreenVideo?.open ? false : true,
                actionTime: fullScreenVideo?.currentTime,
                actionDuration: fullScreenVideo?.duration,
                actionIsPlaying: fullScreenVideo?.isPlaying,
                actionVolume: fullScreenVideo?.volume,
                actionVolumeOpen: fullScreenVideo?.volumeOpen,
                actionAllVideos: fullScreenVideo?.allVideos,
                actionCursor: fullScreenVideo?.cursor,
                actionIndex: fullScreenVideo?.index,
              })
            )
          }
          title={t("rad")}
        >
          <Image
            src={`${INFURA_GATEWAY}/ipfs/QmUkpLp5Jf9NB9eT6dCupJa9fGvA2NkuzTKkqA1uaNFqXL`}
            layout="fill"
            draggable={false}
          />
        </div>
        <div
          className="relative w-8 h-8 pre:h-4/5 flex items-center justify-center cursor-pointer active:scale-95"
          onClick={
            !walletConnected
              ? openConnectModal
              : walletConnected && !lensConnected
              ? () => handleLensConnect()
              : () =>
                  dispatch(
                    setPostBox({
                      actionOpen: true,
                    })
                  )
          }
          title="Make Post"
        >
          <Image
            src={`${INFURA_GATEWAY}/ipfs/QmeNsRR8iiJBZgyeMsnESEKbZPDMB8RFKXxBYC3xYfPovK`}
            layout="fill"
            draggable={false}
          />
        </div>
        {lensConnected && (
          <div
            className="relative w-8 h-8 pre:h-4/5 flex items-center justify-center cursor-pointer rounded-full"
            id="pfp"
            onClick={() => {
              lensConnected && setOpenAccount(!openAccount);
              setCartListOpen(false);
            }}
          >
            {profilePicture && (
              <Image
                src={profilePicture}
                className="rounded-full"
                layout="fill"
                draggable={false}
                objectFit="cover"
                onError={(e) => handleImageError(e)}
              />
            )}
          </div>
        )}
      </div>
      {openAccount && !filtersOpen && (
        <div
          className={`absolute w-32 h-fit right-3 top-14 tablet:top-16 flex items-center justify-center text-sol flex-col font-bit rounded-sm bg-black text-xs z-30 border border-sol ${
            router.asPath?.includes("/checkout") ||
            (!searchActive && router.asPath == "/")
              ? "pre:top-14"
              : "pre:top-24"
          }`}
        >
          <div
            className="relative w-full h-full flex items-center justify-center border-sol cursor-pointer hover:opacity-80 border-b"
            onClick={() => {
              setOpenAccount(false);
              dispatch(
                setFiltersOpen({
                  actionValue: false,
                  actionAllow: false,
                })
              );
              router.push(
                `/autograph/${
                  lensConnected?.handle?.suggestedFormatted?.localName?.split(
                    "@"
                  )[1]
                }`
              );
            }}
          >
            <div className="relative w-fit h-fit items-center justify-center p-2 flex">
              {t("aut")}
            </div>
          </div>
          <div
            className="relative w-full h-full flex items-center justify-center cursor-pointer hover:opacity-80"
            onClick={() => handleLogout()}
          >
            <div className="relative w-fit h-fit items-center justify-center p-2 flex">
              {t("log")}
            </div>
          </div>
        </div>
      )}
      {cartListOpen && !filtersOpen && (
        <CartList
          dispatch={dispatch}
          router={router}
          t={t}
          cartItems={cartItems}
          setCartListOpen={setCartListOpen}
          searchActive={searchActive}
        />
      )}
    </>
  );
};

export default Accounts;
