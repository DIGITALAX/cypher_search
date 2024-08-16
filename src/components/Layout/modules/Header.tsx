import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import SearchBar from "../../Search/modules/SearchBar";
import { HeaderProps } from "../../Search/types/search.types";
import Accounts from "@/components/Common/modules/Accounts";
import { setAllSearchItems } from "../../../../redux/reducers/searchItemsSlice";
import { setSearchActive } from "../../../../redux/reducers/searchActiveSlice";
import { setFiltersOpen } from "../../../../redux/reducers/filtersOpenSlice";
import { SlArrowUp, SlArrowDown } from "react-icons/sl";
import { setHeader } from "../../../../redux/reducers/headerSlice";

const Header: FunctionComponent<HeaderProps> = ({
  handleSearch,
  searchActive,
  openConnectModal,
  handleLensConnect,
  walletConnected,
  lensConnected,
  setOpenAccount,
  openAccount,
  signInLoading,
  filtersOpen,
  handleShuffleSearch,
  placeholderText,
  dispatch,
  layoutAmount,
  cartItems,
  cartListOpen,
  setCartListOpen,
  router,
  includeSearch,
  cartAnim,
  handleLogout,
  searchItems,
  fullScreenVideo,
  filterChange,
  t,
  setLocale,
  locale,
  header,
}): JSX.Element => {
  return !header && window.innerWidth < 400 ? (
    <div
      className={`fixed w-full h-fit flex p-2 top-0 z-30 bg-offBlack justify-center items-center`}
    >
      <div
        className="relative w-fit h-fit flex items-center justify-center cursor-pointer active:scale-95"
        onClick={() => dispatch(setHeader(true))}
      >
        <SlArrowDown color="white" size={15} />
      </div>
    </div>
  ) : (
    <div
      className={`fixed w-full h-fit flex p-2 top-0 z-30 flex-col lg:flex-row bg-offBlack ${
        searchActive || filtersOpen
          ? "items-start justify-center lg:items-center lg:justify-between gap-6 galaxy:gap-8"
          : "items-center justify-between lg:gap-auto gap-3"
      } `}
    >
      <div
        className={`relative h-fit flex items-center justify-between pre:justify-center pre:w-fit w-full flex-row gap-2`}
      >
        <div
          className={`relative cursor-pointer active:scale-95 w-10 h-10 flex items-center justify-center`}
          // href={"/"}
          onClick={(e) => {
            e.stopPropagation();
            router.push("/");
            dispatch(setSearchActive(false));
            dispatch(
              setFiltersOpen({
                actionValue: false,
                actionAllow: false,
              })
            );
            dispatch(
              setAllSearchItems({
                actionItems: [],
                actionHasMore: true,
                actionInput: "",
              })
            );
          }}
        >
          <Image
            src={`${INFURA_GATEWAY}/ipfs/QmYbjMNQAVuQSWNNQ5AKbQtt4Dxw2ax4SvLNwKhCNDniL2`}
            layout="fill"
            draggable={false}
          />
        </div>
        {header && window.innerWidth < 400 && (
          <div
            className="relative w-fit h-fit flex items-center justify-center cursor-pointer active:scale-95"
            onClick={() => dispatch(setHeader(false))}
          >
            <SlArrowUp color="white" size={15} />
          </div>
        )}
      </div>
      {includeSearch && (
        <SearchBar
          filterChange={filterChange}
          t={t}
          locale={locale}
          dispatch={dispatch}
          handleSearch={handleSearch!}
          searchActive={searchActive}
          filtersOpen={filtersOpen}
          handleShuffleSearch={handleShuffleSearch!}
          placeholderText={placeholderText}
          layoutAmount={layoutAmount!}
          router={router}
          searchItems={searchItems}
        />
      )}
      <Accounts
        setLocale={setLocale}
        locale={locale}
        t={t}
        fullScreenVideo={fullScreenVideo}
        cartAnim={cartAnim}
        searchActive={searchActive}
        filtersOpen={filtersOpen}
        lensConnected={lensConnected}
        walletConnected={walletConnected}
        handleLensConnect={handleLensConnect}
        openConnectModal={openConnectModal}
        setOpenAccount={setOpenAccount}
        cartItems={cartItems}
        openAccount={openAccount}
        cartListOpen={cartListOpen}
        signInLoading={signInLoading}
        setCartListOpen={setCartListOpen}
        router={router}
        handleLogout={handleLogout}
        dispatch={dispatch}
      />
    </div>
  );
};

export default Header;
