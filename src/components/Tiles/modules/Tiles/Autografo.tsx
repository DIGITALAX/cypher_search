import { FunctionComponent } from "react";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "../../../../../lib/constants";
import { setImageViewer } from "../../../../../redux/reducers/ImageLargeSlice";
import { AutografoProps } from "../../types/tiles.types";
import MediaSwitch from "@/components/Common/modules/MediaSwitch";
import HoverProfile from "@/components/Common/modules/HoverProfile";

const Autografo: FunctionComponent<AutografoProps> = ({
  publication,
  router,
  dispatch,
  t,
  index,
  setProfileHovers,
  followLoading,
  followProfile,
  unfollowProfile,
  profileHovers,
  lensConnected,
}): JSX.Element => {
  return (
    <div
      className="relative w-full h-fit flex items-end justify-center flex flex-col rounded-sm border border-sol p-4 gap-4"
      id={publication?.coleccionId?.toString()}
    >
      <div className="relative flex flex-col items-center justify-start w-full h-fit gap-5">
        <div className="flex items-center justify-center w-full h-fit break-all text-center font-bit text-white text-base">
          {t("auto")}
        </div>
        <div className="relative flex flex-row w-full justifty-between items-start h-fit gap-4">
          <div
            className="w-full h-72 rounded-sm bg-amo/30 border border-white cursor-pointer relative"
            onClick={() =>
              dispatch(
                setImageViewer({
                  actionValue: true,
                  actionType: "png",
                  actionImage: `${INFURA_GATEWAY}/ipfs/${
                    publication?.imagen?.split("ipfs://")?.[1]
                  }`,
                })
              )
            }
          >
            <MediaSwitch
              type={"image"}
              srcUrl={`${INFURA_GATEWAY}/ipfs/${
                publication?.imagen?.split("ipfs://")?.[1]
              }`}
            />
          </div>
        </div>
        <div className="relative flex flex-row justify-between gap-2 w-full h-fit items-center">
          <div className="relative gap-1 flex flex-col items-start justify-center">
            <div className="relative flex w-fit h-fit break-all text-nuba font-bit text-lg uppercase">
              {publication?.titulo}
            </div>
            <div
              className="relative w-fit h-fit flex text-mos text-sm font-bit uppercase cursor-pointer"
              onMouseEnter={() =>
                setProfileHovers((prev) => {
                  const updatedArray = [...prev];
                  updatedArray[index] = true;
                  return updatedArray;
                })
              }
            >
              {publication?.profile?.handle?.suggestedFormatted?.localName}
            </div>
            {profileHovers?.[index] && (
              <HoverProfile
                followLoading={followLoading}
                followProfile={followProfile}
                unfollowProfile={unfollowProfile}
                router={router}
                publication={publication?.profile!}
                index={index}
                setProfileHovers={setProfileHovers}
                dispatch={dispatch}
                lensConnected={lensConnected}
                parentId={publication?.coleccionId?.toString()!}
                top={"auto"}
                bottom={"2px"}
                left={"2px"}
                right={"auto"}
              />
            )}
          </div>
          <div className="relative w-fit h-fit flex items-end justify-center mb-0 cursor-pointer active:scale-95">
            <div
              className="relative w-10 h-10 flex"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                router.push(
                  `/item/catalog/${publication?.titulo?.replaceAll(" ", "_")}`
                );
              }}
            >
              <Image
                layout="fill"
                src={`${INFURA_GATEWAY}/ipfs/QmZ4v5pzdnCBeyKnS9VrjZiEAbUpAVy8ECArNcpxBt6Tw4`}
                draggable={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Autografo;
