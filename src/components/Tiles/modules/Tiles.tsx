import { FunctionComponent, memo, useCallback, useMemo } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Creation, Publication, TilesProps } from "../types/tiles.types";
import TileSwitch from "./TileSwitch";
import { Masonry } from "masonic";
import { debounce } from "lodash";
import stringify from "json-stable-stringify";

const TileSwitchMemo = memo(TileSwitch);

const useDeepMemoize = (value: Object[]) => {
  const hash = useMemo(() => stringify(value), [value]);
  return hash;
};

const Tiles: FunctionComponent<TilesProps> = ({
  handleMoreSearch,
  searchActive,
  t,
  layoutAmount,
  popUpOpen,
  setPopUpOpen,
  dispatch,
  router,
  cartItems,
  mirror,
  like,
  simpleCollect,
  interactionsLoading,
  openMirrorChoice,
  setOpenMirrorChoice,
  filtersOpen,
  searchLoading,
  unfollowProfile,
  followProfile,
  followLoading,
  profileHovers,
  setProfileHovers,
  searchItems,
  moreSearchLoading,
  locale,
  lensConnected,
  filterConstants,
}): JSX.Element => {
  const interactionsLoadingMemo = useDeepMemoize(interactionsLoading);
  const searchItemsMemo = useDeepMemoize(searchItems?.items || []);
  const debouncedHandleMoreSearch = useCallback(
    debounce(() => {
      if (searchItems?.hasMore && !searchLoading && !moreSearchLoading) {
        handleMoreSearch();
      }
    }, 300),
    [searchItems, searchLoading, moreSearchLoading, handleMoreSearch]
  );

  const renderTile = useCallback(
    ({ index, data }: { index: number; data: Publication }) => {
      return (
        <TileSwitchMemo
          locale={locale}
          type={data?.type}
          filterConstants={filterConstants}
          lensConnected={lensConnected}
          publication={data}
          t={t}
          cartItems={cartItems}
          layoutAmount={layoutAmount}
          popUpOpen={popUpOpen}
          setPopUpOpen={setPopUpOpen}
          index={index}
          dispatch={dispatch}
          router={router}
          mirror={mirror}
          like={like}
          interactionsLoading={interactionsLoading}
          openMirrorChoice={openMirrorChoice}
          setOpenMirrorChoice={setOpenMirrorChoice}
          followLoading={followLoading}
          followProfile={followProfile}
          unfollowProfile={unfollowProfile}
          profileHovers={profileHovers}
          setProfileHovers={setProfileHovers}
          simpleCollect={simpleCollect}
          collectionsRelated={
            data?.type == "Microbrand"
              ? (searchItems?.items
                  ?.filter(
                    (value) =>
                      (
                        value?.post as Creation
                      )?.collectionMetadata?.microbrand?.toLowerCase() ===
                      (data?.post as any)?.microbrandName?.toLowerCase()
                  )
                  ?.map((item) => item?.post) as Creation[])
              : undefined
          }
        />
      );
    },
    [
      interactionsLoadingMemo,
      profileHovers,
      openMirrorChoice,
      followLoading,
      popUpOpen,
      layoutAmount,
      searchItemsMemo,
    ]
  );

  return (
    <div
      className={`relative w-full min-h-screen h-fit overflow-y-scroll pb-6 px-4 ${
        searchActive || filtersOpen
          ? "pt-[30rem] galaxy:pt-[28rem] pre:pt-56 tablet:pt-44"
          : "pt-24"
      }`}
      id="tileSearch"
    >
      <InfiniteScroll
        dataLength={
          searchLoading
            ? 20
            : (searchItems?.items || [])?.length + (moreSearchLoading ? 20 : 0)
        }
        loader={<></>}
        scrollThreshold={1}
        hasMore={searchItems?.hasMore!}
        next={debouncedHandleMoreSearch}
        className={`w-full h-screen items-start justify-center ${
          searchActive && "fadeTiles"
        }`}
      >
        <Masonry
          overscanBy={5}
          key={
            searchLoading
              ? 20
              : (searchItems?.items || [])?.length +
                (moreSearchLoading ? 20 : 0)
          }
          items={
            moreSearchLoading
              ? [
                  ...(searchItems?.items || []),
                  ...Array.from({ length: 20 }, (_) => ({
                    id: Math.random(),
                    type: "loader",
                  })),
                ]
              : searchLoading
              ? Array.from({ length: 20 }, (_) => ({
                  id: Math.random(),
                  type: "loader",
                }))
              : searchItems?.items || []
          }
          render={renderTile}
          columnGutter={50}
          maxColumnCount={layoutAmount}
        />
      </InfiniteScroll>
    </div>
  );
};

export default Tiles;
