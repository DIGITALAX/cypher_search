import usePagina from "@/components/Tiles/hooks/usePagina";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import {
  ACCEPTED_TOKENS,
  COUNTRIES,
  INFURA_GATEWAY,
} from "../../../../lib/constants";
import { CatalogoProps } from "../types/item.types";
import { AiOutlineLoading } from "react-icons/ai";
import handleImageError from "../../../../lib/helpers/handleImageError";

const Catalogo: FunctionComponent<CatalogoProps> = ({
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
  header,
}): JSX.Element => {
  const { bookRef } = usePagina(itemData);

  return (
    <div
      className={`relative w-full h-fit xl:h-[50rem] flex items-center justify-center flex-row pre:pt-60 tablet:pt-40 lg:pt-32 px-2 sm:px-12 gap-12 xl:gap-7 flex-wrap xl:flex-nowrap ${
        header ? "pt-96" : "pt-0"
      }`}
    >
      <div
        className="relative w-full h-full flex items-center justify-center overflow-hidden"
        id="padre"
      >
        <div
          className="relative flex items-center justify-center overflow-hidden"
          ref={bookRef}
          style={{
            height: window.innerWidth > 1200 ? 750 : window.innerWidth / 3,
          }}
        >
          {itemData?.paginas?.map((pagina: string, indice: number) => (
            <div
              key={indice}
              className="pagina relative flex items-center justify-center"
            >
              <Image
                src={`${INFURA_GATEWAY}/ipfs/${pagina.split("ipfs://")[1]}`}
                layout="fill"
                objectFit="contain"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="relative w-full xl:w-fit h-fit flex items-center xl:items-end justify-start ml-auto flex-col gap-12">
        <div className="relative w-full xl:w-fit h-full flex items-center xl:items-end justify-start flex-col gap-3 mt-auto">
          <div className="flex flex-col gap-2 items-center xl:items-end justify-start relative">
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
                  itemData?.tokenes?.includes(item?.[2]?.toLowerCase())
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
          <div className="relative flex flex-row flex-wrap items-center justify-center xl:items-end xl:justify-end gap-5 w-full xl:w-1/2 h-fit">
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
                          (details as any)?.[item?.title?.toLowerCase()] || ""
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
        </div>
        <div className="relative w-fit h-fit flex items-center justify-center flex-row gap-6 justify-start xl:justify-end items-start xl:items-end">
          <div
            className={`relative w-32 text-sm h-8 rounded-sm flex items-center justify-center border border-white text-black font-bit text-xs bg-sol px-2 py-1 ${
              !address || itemData?.cantidad == itemData?.minteado
                ? "opacity-70"
                : !instantLoading && "cursor-pointer active:scale-95"
            }`}
            onClick={() =>
              address &&
              !instantLoading &&
              itemData?.cantidad != itemData?.minteado &&
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
                itemData?.minteado !== undefined &&
                itemData?.cantidad == itemData?.minteado ? (
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

export default Catalogo;
