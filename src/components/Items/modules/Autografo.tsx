import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import {
  ACCEPTED_TOKENS,
  COUNTRIES,
  INFURA_GATEWAY,
  printTypeToString,
} from "../../../../lib/constants";
import { AutografoProps } from "../types/item.types";
import { AiOutlineLoading } from "react-icons/ai";
import handleImageError from "../../../../lib/helpers/handleImageError";
import MediaSwitch from "@/components/Common/modules/MediaSwitch";
import { setImageViewer } from "../../../../redux/reducers/ImageLargeSlice";
import PrintType from "@/components/Common/modules/PrintType";
import { AutographType } from "@/components/Tiles/types/tiles.types";
import createProfilePicture from "../../../../lib/helpers/createProfilePicture";
import { setAllSearchItems } from "../../../../redux/reducers/searchItemsSlice";

const Autografo: FunctionComponent<AutografoProps> = ({
  purchaseDetails,
  setPurchaseDetails,
  handleInstantPurchase,
  instantLoading,
  approveSpend,
  isApprovedSpend,
  oracleData,
  itemData,
  t,
  address,
  details,
  setDetails,
  setOpenDropdown,
  openDropdown,
  router,
  dispatch,
  allSearchItems,
  header,
}): JSX.Element => {
  const profilePicture = createProfilePicture(
    itemData?.profile?.metadata?.picture
  );
  return (
    <div
      className={`relative w-full h-fit xl:h-[50rem] flex items-center justify-center flex-row pre:pt-60 tablet:pt-40 lg:pt-32 px-2 sm:px-12 gap-12 xl:gap-7 flex-wrap xl:flex-nowrap ${
        header ? "pt-96" : "pt-0"
      }  ${
        itemData?.tipo !== AutographType.NFT
          ? "items-start overflow-y-scroll"
          : "items-center"
      }`}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="relative flex flex-col gap-2 items-center justify-center w-full sm:w-[40rem] h-full">
          <div
            className={`relative p-3 bg-black flex justify-center w-full h-[25rem] pre:h-[30rem] items-center`}
          >
            <div className="flex items-center justify-center w-full h-full bg-amo/30 p-1">
              <div
                className={`relative w-full h-full flex items-center justify-centercursor-pointer`}
                onClick={() =>
                  dispatch(
                    setImageViewer({
                      actionValue: true,
                      actionImage: `${INFURA_GATEWAY}/ipfs/${
                        itemData?.imagen?.split("ipfs://")?.[1]
                      }`,
                      actionType: "png",
                    })
                  )
                }
              >
                <MediaSwitch
                  type={"image"}
                  srcUrl={`${INFURA_GATEWAY}/ipfs/${
                    itemData?.imagen?.split("ipfs://")?.[1]
                  }`}
                  classNameImage="flex items-center justify-center w-full h-full relative"
                  objectFit="contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative w-full h-fit flex items-center sm:items-end justify-start ml-auto flex-col gap-12">
        <div className="relative w-full h-full flex items-center sm:items-end justify-start ml-auto flex-col gap-4">
          <div className="relative w-fit h-fit flex items-end justify-end font-aust text-white break-all text-5xl mt-0">
            {itemData?.titulo}
          </div>

          {itemData?.tipo !== AutographType.NFT && (
            <div className="relative w-fit h-fit flex items-end justify-end font-aust text-white break-all text-sm mt-0">
              <PrintType
                t={t}
                printType={
                  printTypeToString[
                    itemData?.tipo == AutographType.Hoodie ? 3 : 2
                  ]
                }
              />
            </div>
          )}
          <div className="relative w-fit h-fit gap-4 flex-row flex flex-wrap items-end justify-end">
            <div className="relative w-fit h-fit flex flex-row gap-2 items-end justify-end font-aust text-white break-words text-sm cursor-pointer">
              <div
                className="relative flex flex-row gap-4 w-5 h-5 items-center justify-start rounded-full border border-offWhite"
                id="pfp"
                onClick={() =>
                  router.push(
                    `/autograph/${itemData?.profile?.handle?.suggestedFormatted?.localName?.replace(
                      "@",
                      ""
                    )}`
                  )
                }
              >
                {profilePicture && (
                  <Image
                    layout="fill"
                    draggable={false}
                    src={profilePicture}
                    onError={(e) => handleImageError(e)}
                    objectFit="cover"
                    className="rounded-full"
                  />
                )}
              </div>
              <div className="relative w-fit h-fit items-center justify-center flex">
                {itemData?.profile?.handle?.suggestedFormatted?.localName}
              </div>
            </div>
          </div>
          <div className="relative flex items-center sm:items-end w-fit h-fit justify-end text-sol font-bit justify-center flex-col gap-1.5 sm:ml-auto">
            <div className="relative w-full h-fit items-center sm:items-end justify-end text-base ml-auto">
              {Number(itemData?.cantidad) -
                Number(itemData?.tokenesMinteados?.length || 0) >
                0 || !itemData?.tokenesMinteados?.length
                ? `${
                    itemData?.tokenesMinteados?.length
                      ? Number(itemData?.tokenesMinteados?.length || 0)
                      : 0
                  }/${Number(itemData?.cantidad)}`
                : t("sold")}
            </div>
          </div>
          <div className="relative w-fit h-fit flex items-start justify-center sm:justify-end font-aust text-white break-words text-xs text-center sm:text-right mt-0 max-h-[6rem] overflow-y-scroll">
            <div className="relative w-5/6 h-fit flex items-start justiy-center sm:justify-end break-all">
              {itemData?.descripcion}
            </div>
          </div>
          <div className="relative w-full h-fit flex font-bit text-xxs text-white justify-center items-center sm:justify-end">
            <div className="relative w-1/2 max-h-[6rem] overflow-y-scroll h-fit flex flex-wrap items-center sm:items-end justify-center sm:justify-end sm:ml-auto gap-3">
              {itemData?.etiquetas
                ?.split(",")
                ?.map((tag: string, index: number) => {
                  return (
                    <div
                      key={index}
                      className="relative w-fit h-fit px-2 py-1 rounded-full flex items-center justify-center text-center cursor-pointer hover:opacity-80"
                      style={{
                        backgroundColor:
                          index % 3 === 0
                            ? "#078fd6"
                            : index % 4 === 0
                            ? "#e981ff"
                            : "#81A8F8",
                      }}
                      onClick={() =>
                        dispatch(
                          setAllSearchItems({
                            actionItems: allSearchItems?.items,
                            actionInput:
                              allSearchItems?.searchInput + " " + tag,
                            actionLensPubCursor: allSearchItems?.lensPubCursor,
                            actionGraphCursor: allSearchItems?.graphCursor,
                            actionLensProfileCursor:
                              allSearchItems?.lensProfileCursor,
                            actionHasMore: allSearchItems?.hasMore,
                          })
                        )
                      }
                    >
                      <div className="relative w-fit h-fit flex top-px">
                        {tag}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
        <div className="relative w-full h-full flex items-center sm:items-end justify-start flex-col gap-3 mt-auto">
          <div className="flex flex-col gap-2 items-center sm:items-end justify-start relative">
            <div className="relative text-2xl font-bit w-fit h-fit text-sol font-bit items-center justify-center">
              {`${Number(
                (
                  Number(itemData?.precio) /
                  Number(
                    oracleData?.find(
                      (oracle) =>
                        oracle.currency?.toLowerCase() ===
                        itemData?.tokenes?.find(
                          (item) =>
                            item?.toLowerCase() ===
                            purchaseDetails?.currency?.toLowerCase()
                        )
                    )?.rate
                  )
                )?.toFixed(3)
              )} ${
                ACCEPTED_TOKENS?.filter((item) =>
                  itemData?.tokenes?.includes(item?.[2]?.toLowerCase() as any)
                )?.find(
                  (item) =>
                    item?.[2]?.toLowerCase() ===
                    purchaseDetails?.currency?.toLowerCase()
                )?.[1]
              }`}
            </div>
            <div className="relative flex flex-row gap-3 items-center justify-center">
              {itemData?.tokenes?.map((item: string, indexTwo: number) => {
                return (
                  <div
                    className={`relative w-fit h-fit rounded-full flex items-center cursor-pointer active:scale-95 ${
                      purchaseDetails?.currency === item
                        ? "opacity-50"
                        : "opacity-100"
                    }`}
                    key={indexTwo}
                    onClick={() =>
                      setPurchaseDetails((prev) => ({
                        ...prev,
                        currency: item,
                      }))
                    }
                  >
                    <Image
                      src={`${INFURA_GATEWAY}/ipfs/${
                        ACCEPTED_TOKENS?.find(
                          (value) =>
                            value[2]?.toLowerCase() == item?.toLowerCase()
                        )?.[0]
                      }`}
                      onError={(e) => handleImageError(e)}
                      className="flex rounded-full"
                      draggable={false}
                      width={30}
                      height={35}
                    />
                  </div>
                );
              })}
            </div>
          </div>
          {itemData.tipo !== AutographType.NFT && (
            <>
              <div className="relative w-fit h-fit flex flex-row gap-6 items-end justify-end text-white font-bit text-xxs pt-4">
                <div className="relative flex items-end w-fit h-fit justify-end items-center justify-center flex-col gap-1.5 ml-auto">
                  <div className="relative w-full h-fit items-end justify-end text-base ml-auto">
                    Color
                  </div>
                  <div className="relative flex flex-row gap-2 items-center justify-center w-fit h-fit flex-wrap">
                    {["black", "white"]?.map((item: string, index: number) => {
                      return (
                        <div
                          key={index}
                          className={`relative w-6 h-6 flex items-center justify-center rounded-full cursor-pointer active:scale-95 border ${
                            item === purchaseDetails?.color
                              ? "border-sol opacity-70"
                              : "border-white opacity-100"
                          }`}
                          style={{
                            backgroundColor: item,
                          }}
                          onClick={() =>
                            setPurchaseDetails((prev) => ({
                              ...prev,
                              color: item,
                            }))
                          }
                        ></div>
                      );
                    })}
                  </div>
                </div>
                <div className="relative flex items-end justify-end items-center justify-center h-fit w-fit flex-col gap-1.5 ml-auto">
                  <div className="relative w-full h-fit items-end justify-end text-base ml-auto">
                    {t("siz")}
                  </div>
                  <div className="relative flex flex-row gap-2 items-center justify-center w-fit h-fit flex-wrap">
                    {["xs", "s", "m", "l", "xl", "2xl"]?.map(
                      (item: string, index: number) => {
                        return (
                          <div
                            key={index}
                            className={`w-6 rounded-full relative flex h-6 items-center justify-center cursor-pointer text-white font-bit text-xxs active:scale-95 border ${
                              item === purchaseDetails?.size
                                ? "border-sol opacity-70"
                                : "border-white opacity-100"
                            }`}
                            onClick={() =>
                              setPurchaseDetails((prev) => ({
                                ...prev,
                                size: item,
                              }))
                            }
                          >
                            <div className="relative w-fit h-fit flex items-center justify-center top-px">
                              {item}
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>
              <div className="relative flex flex-row flex-wrap items-center justify-center pt-4 xl:items-end xl:justify-end gap-5 w-full xl:w-1/2 h-fit">
                {[
                  {
                    title: t("nam"),
                    drop: false,
                  },
                  {
                    title: t("addr"),
                    drop: false,
                  },
                  {
                    title: t("zip"),
                    drop: false,
                  },
                  {
                    title: t("city"),
                    drop: false,
                  },
                  {
                    title: t("state"),
                    drop: false,
                  },
                  {
                    title: t("country"),
                    drop: true,
                  },
                ].map(
                  (
                    item: {
                      title: string;
                      drop: boolean;
                    },
                    index: number
                  ) => {
                    return (
                      <div
                        key={index}
                        className={`relative w-fit h-fit flex items-start justify-center flex-col gap-2`}
                      >
                        <div className="relative w-fit h-fit flex text-white font-aust text-base">
                          {item?.title}
                        </div>
                        {item?.drop ? (
                          <div className="relative w-fit h-fit flex flex-col items-start justify-start gap-1">
                            <div
                              className={`relative h-8 flex flex-row justify-between p-2 w-28 items-center justify-center border border-white rounded-md`}
                              onClick={() => setOpenDropdown(!openDropdown)}
                            >
                              <div className="relative w-fit h-fit flex items-center justify-center font-aust text-white text-xxs">
                                {details?.country}
                              </div>
                              <div className="relative w-4 h-3 flex items-center justify-center">
                                <Image
                                  layout="fill"
                                  draggable={false}
                                  src={`${INFURA_GATEWAY}/ipfs/QmRKmMYJj7KAwf4BDGwrd51tKWoS8djnLGWT5XNdrJMztk`}
                                />
                              </div>
                            </div>
                            {openDropdown && (
                              <div className="absolute top-10 bg-offBlack z-10 w-40 h-60 flex border border-white rounded-md overflow-y-scroll">
                                <div className="relative w-full h-fit flex flex-col items-center justify-start">
                                  {COUNTRIES?.map(
                                    (country: string, index: number) => {
                                      return (
                                        <div
                                          key={index}
                                          className="relative w-full py-1 h-10 flex items-center justify-center text-white border-y border-white font-aust text-xxs cursor-pointer hover:opacity-80"
                                          onClick={() => {
                                            // if (details?.country !== country) {
                                            //   setEncryptedStrings([]);
                                            // }
                                            setOpenDropdown(false);
                                            setDetails((prev) => ({
                                              ...prev,
                                              country,
                                            }));
                                          }}
                                        >
                                          {country}
                                        </div>
                                      );
                                    }
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <input
                            className={`relative border border-white rounded-md flex bg-offBlack font-aust text-white text-sm p-2 h-8 w-28`}
                            placeholder={
                              (details as any)?.[item?.title?.toLowerCase()] ||
                              ""
                            }
                            onChange={(e) => {
                              // if (
                              //   (details as any)?.[item?.title?.toLowerCase()] !==
                              //   e.target.value
                              // ) {
                              //   setEncryptedStrings([]);
                              // }
                              setDetails((prev) => ({
                                ...prev,
                                [item?.title?.toLowerCase()]: e.target.value,
                              }));
                            }}
                          />
                        )}
                      </div>
                    );
                  }
                )}
              </div>
            </>
          )}
        </div>
        <div className="relative w-fit h-fit flex items-center justify-center flex-row gap-6 justify-end items-end">
          <div
            className={`relative w-32 text-sm h-8 rounded-sm flex items-center justify-center border border-white text-black font-bit text-xs bg-sol px-2 py-1 ${
              address ||
              itemData?.cantidad == itemData?.tokenesMinteados?.length
                ? "opacity-70"
                : !instantLoading && "cursor-pointer active:scale-95"
            }`}
            onClick={() =>
              address &&
              !instantLoading &&
              itemData?.cantidad != itemData?.tokenesMinteados?.length &&
              (isApprovedSpend ? handleInstantPurchase() : approveSpend())
            }
            title={t("checkI")}
          >
            <div
              className={`relative w-fit h-fit flex items-center justify-center ${
                instantLoading && "animate-spin"
              }`}
            >
              {instantLoading ? (
                <AiOutlineLoading size={15} color="white" />
              ) : itemData?.cantidad !== undefined &&
                itemData?.tokenesMinteados?.length !== undefined &&
                itemData?.cantidad == itemData?.tokenesMinteados?.length ? (
                t("sold")
              ) : !address ? (
                t("con2")
              ) : !isApprovedSpend ? (
                t("ap")
              ) : (
                t("col2")
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Autografo;
