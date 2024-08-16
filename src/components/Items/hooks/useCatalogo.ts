import { Details } from "@/components/Autograph/types/autograph.types";
import {
  checkAndSignAuthMessage,
  encryptString,
  LitNodeClient,
} from "@lit-protocol/lit-node-client";
import { useEffect, useState } from "react";
import { createWalletClient, custom, PublicClient } from "viem";
import { polygon } from "viem/chains";
import { PurchaseDetails } from "../types/item.types";
import {
  AutographType,
  Catalogo,
  Coleccion,
} from "@/components/Tiles/types/tiles.types";
import {
  AUTOGRAPH_MARKET,
  autographTypeToNumber,
  DIGITALAX_ADDRESS,
} from "../../../../lib/constants";
import { OracleData } from "@/components/Checkout/types/checkout.types";
import AutographMarket from "./../../../../abis/AutographMarket.json";
import { setSuccessCheckout } from "../../../../redux/reducers/successCheckoutSlice";
import { Dispatch } from "redux";
import { AccessControlConditions } from "@lit-protocol/types";

const useCatalogo = (
  address: `0x${string}` | undefined,
  client: LitNodeClient,
  publicClient: PublicClient,
  purchaseDetails: PurchaseDetails,
  elemento: Catalogo | Coleccion,
  datosOraculos: OracleData[],
  dispatch: Dispatch,
  type: string | undefined
) => {
  const [details, setDetails] = useState<Details>({
    name: "",
    contact: "",
    address: "",
    zip: "",
    city: "",
    state: "",
    country: "",
    colors: [],
    sizes: [],
  });
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const [compraCargando, setCompraCargando] = useState<boolean>(false);
  const [aprobado, setAprobado] = useState<boolean>(false);
  const [gastosAprobados, setGastosAprobados] = useState<boolean>(false);

  const encryptFulfillment = async () => {
    if (
      !address ||
      details?.address?.trim() === "" ||
      details?.city?.trim() === "" ||
      details?.name?.trim() === "" ||
      details?.state?.trim() === "" ||
      details?.zip?.trim() === "" ||
      details?.country?.trim() === ""
    )
      return;
    try {
      let nonce = client.getLatestBlockhash();

      const authSig = await checkAndSignAuthMessage({
        chain: "polygon",
        nonce: nonce!,
      });
      await client.connect();

      const accessControlConditions = [
        {
          contractAddress: "",
          standardContractType: "",
          chain: "mumbai",
          method: "",
          parameters: [":userAddress"],
          returnValueTest: {
            comparator: "=",
            value: address.toLowerCase(),
          },
        },
        { operator: "or" },
        {
          contractAddress: "",
          standardContractType: "",
          chain: "mumbai",
          method: "",
          parameters: [":userAddress"],
          returnValueTest: {
            comparator: "=",
            value: DIGITALAX_ADDRESS?.toLowerCase(),
          },
        },
      ] as AccessControlConditions;

      const { ciphertext, dataToEncryptHash } = await encryptString(
        {
          accessControlConditions,
          chain: "polygon",
          dataToEncrypt: JSON.stringify({
            ...details,
            amounts: [1],
            collectionIds: [(elemento as Coleccion)?.coleccionId || 0],
            prices: [elemento?.precio],
            types: [elemento?.tipo],
            ...purchaseDetails,
          }),
          authSig,
        },
        client! as any
      );

      return JSON.stringify({
        ciphertext,
        dataToEncryptHash,
        accessControlConditions,
      });
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const aprobarGastos = async () => {
    setCompraCargando(true);
    try {
      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      const { request } = await publicClient.simulateContract({
        address: purchaseDetails?.currency as `0x${string}`,
        abi: [
          purchaseDetails?.currency ===
          "0x6968105460f67c3bf751be7c15f92f5286fd0ce5"
            ? {
                inputs: [
                  {
                    internalType: "address",
                    name: "spender",
                    type: "address",
                  },
                  {
                    internalType: "uint256",
                    name: "tokens",
                    type: "uint256",
                  },
                ],
                name: "approve",
                outputs: [
                  { internalType: "bool", name: "success", type: "bool" },
                ],
                stateMutability: "nonpayable",
                type: "function",
              }
            : purchaseDetails?.currency ===
              "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270"
            ? {
                constant: false,
                inputs: [
                  { name: "guy", type: "address" },
                  { name: "wad", type: "uint256" },
                ],
                name: "approve",
                outputs: [{ name: "", type: "bool" }],
                payable: false,
                stateMutability: "nonpayable",
                type: "function",
              }
            : {
                inputs: [
                  {
                    internalType: "address",
                    name: "spender",
                    type: "address",
                  },
                  {
                    internalType: "uint256",
                    name: "amount",
                    type: "uint256",
                  },
                ],
                name: "approve",
                outputs: [
                  {
                    internalType: "bool",
                    name: "",
                    type: "bool",
                  },
                ],
                stateMutability: "nonpayable",
                type: "function",
              },
        ],
        functionName: "approve",
        chain: polygon,
        args: [
          AUTOGRAPH_MARKET,
          BigInt(
            Number(
              (Number(elemento?.precio * 1.5) /
                Number(
                  datosOraculos?.find(
                    (oraculo) => oraculo.currency === purchaseDetails?.currency
                  )?.rate
                )) *
                Number(
                  datosOraculos?.find(
                    (oraculo) => oraculo.currency === purchaseDetails?.currency
                  )?.wei
                )
            ).toFixed(0)
          ),
        ],
        account: address,
      });
      const res = await clientWallet.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash: res });

      setGastosAprobados(true);
    } catch (err: any) {
      console.error(err.message);
    }
    setCompraCargando(false);
  };

  const comprobarAprobado = async () => {
    try {
      const data = await publicClient.readContract({
        address: purchaseDetails?.currency?.toLowerCase() as `0x${string}`,
        abi: [
          {
            inputs: [
              {
                internalType: "address",
                name: "owner",
                type: "address",
              },
              {
                internalType: "address",
                name: "spender",
                type: "address",
              },
            ],
            name: "allowance",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
        ],
        functionName: "allowance",
        args: [address as `0x${string}`, AUTOGRAPH_MARKET],
        account: address,
      });

      if (address) {
        if (
          Number((data as any)?.toString()) /
            Number(
              datosOraculos?.find(
                (oraculo) => oraculo.currency === purchaseDetails?.currency
              )?.wei
            ) >=
          elemento.precio /
            Number(
              datosOraculos?.find(
                (oraculo) => oraculo.currency === purchaseDetails?.currency
              )?.rate
            )
        ) {
          setAprobado(true);
        } else {
          setAprobado(false);
        }
      } else {
        setAprobado(false);
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const manejarCompra = async () => {
    setCompraCargando(true);
    try {
      let cadenasCifradas: string | undefined = "";
      if (elemento.tipo !== AutographType.NFT) {
        cadenasCifradas = await encryptFulfillment();
      }

      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      const { request } = await publicClient.simulateContract({
        address: AUTOGRAPH_MARKET,
        abi: AutographMarket,
        functionName: "buyTokens",
        chain: polygon,
        args: [
          [purchaseDetails?.currency],
          [Number((elemento as Coleccion)?.coleccionId) || 0],
          [0],
          [1],
          [autographTypeToNumber[elemento.tipo]],
          cadenasCifradas,
        ],
        account: address,
      });

      const res = await clientWallet.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash: res });

      setDetails({
        name: "",
        contact: "",
        address: "",
        zip: "",
        city: "",
        state: "",
        country: "",
        colors: [],
        sizes: [],
      });
      dispatch(setSuccessCheckout(true));
    } catch (err: any) {
      console.error(err.message);
    }
    setCompraCargando(false);
  };

  useEffect(() => {
    if (
      type === "catalog" &&
      purchaseDetails?.currency &&
      purchaseDetails?.currency !== "" &&
      address
    ) {
      comprobarAprobado();
    }
  }, [purchaseDetails?.currency, address]);

  return {
    details,
    setDetails,
    openDropdown,
    setOpenDropdown,
    aprobado,
    compraCargando,
    manejarCompra,
    aprobarGastos,
  };
};

export default useCatalogo;
