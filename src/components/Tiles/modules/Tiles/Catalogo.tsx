import { FunctionComponent } from "react";
import toHexWithLeadingZero from "../../../../../lib/helpers/leadingZero";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "../../../../../lib/constants";
import { setImageViewer } from "../../../../../redux/reducers/ImageLargeSlice";
import { CatalogoProps } from "../../types/tiles.types";

const Catalogo: FunctionComponent<CatalogoProps> = ({
  publication,
  router,
  dispatch,
  t,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit sm:h-80 border border-cost rounded-sm p-2 flex flex-col gap-4">
      <div className="relative w-full h-fit flex items-center justify-center ">
        <div
          className="relative w-4 h-4 flex items-end justify-end cursor-pointer"
          onClick={() => router.push(`/item/catalog/autograph-quarterly`)}
        >
          <Image
            src={`${INFURA_GATEWAY}/ipfs/QmRkAoLMAh2hxZfh5WvaxuxRUMhs285umdJWuvLa5wt6Ht`}
            draggable={false}
            layout="fill"
          />
        </div>
      </div>
      <div className="flex items-center justify-center w-full h-fit break-all text-center font-bit text-white text-base">
        {t("auto")}
      </div>
      <div className="relative w-full h-full overflow-y-scroll flex items-center justify-center gap-2 flex-row flex-wrap">
        {publication?.paginas?.map((p, indice) => {
          return (
            <div
              key={indice}
              className="relative w-14 h-10 flex items-center justify-center cursor-pointer hover:opacity-70"
              onClick={() =>
                dispatch(
                  setImageViewer({
                    actionValue: true,
                    actionType: "png",
                    actionImage: `${INFURA_GATEWAY}/ipfs/${
                      p?.split("ipfs://")[1]
                    }`,
                  })
                )
              }
            >
              <Image
                src={`${INFURA_GATEWAY}/ipfs/${p?.split("ipfs://")[1]}`}
                layout="fill"
                objectFit="contain"
                draggable={false}
              />
            </div>
          );
        })}
      </div>
      <div className="relative text-xs text-white/80 flex items-center justify-center w-full text-center h-fit font-bit">
        {t("cata")}
      </div>
    </div>
  );
};

export default Catalogo;
