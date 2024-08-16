import {
  AutographType,
  Catalogo,
  Coleccion,
} from "@/components/Tiles/types/tiles.types";
import { Profile } from "../../graphql/generated";
import { getCatalogo } from "../../graphql/subgraph/queries/getCatalogo";
import getDefaultProfile from "../../graphql/lens/queries/default";
import {
  getArticulo,
  getUnArticulo,
} from "../../graphql/subgraph/queries/getArticulo";
import { INFURA_GATEWAY, numberToAutograph } from "../constants";

export const manejearCatalogos = async (
  lensConectado: Profile | undefined,
  first: number,
  skip: number,
  solo?: string
): Promise<(Coleccion | Catalogo)[] | undefined> => {
  try {
    let articulos: (Coleccion | Catalogo)[] | undefined;
    if (!solo || solo?.includes("autograph-quarterly")) {
      const datos = await getCatalogo();
      const prof = await getDefaultProfile(
        {
          for: datos?.data?.autographCreateds[0].designer,
        },
        lensConectado?.id
      );
      const cadena = await fetch(
        `${INFURA_GATEWAY}/ipfs/${
          datos?.data?.autographCreateds[0].uri?.split("ipfs://")?.[1]
        }`
      );
      articulos = [
        {
          paginas: datos?.data?.autographCreateds[0].pages,
          tokenes: datos?.data?.autographCreateds[0].acceptedTokens,
          uri: await cadena.json(),
          disenador: datos?.data?.autographCreateds[0].designer,
          precio: datos?.data?.autographCreateds[0].price,
          id: datos?.data?.autographCreateds[0].id,
          pubId: datos?.data?.autographCreateds[0].pubId,
          profileId: datos?.data?.autographCreateds[0].profileId,
          cantidad: datos?.data?.autographCreateds[0].amount,
          minteado: datos?.data?.autographCreateds[0].mintedTokens,
          paginasContadas: datos?.data?.autographCreateds[0].pageCount,
          profile: prof?.data?.defaultProfile as Profile,
          tipo: AutographType.Catalog,
        },
      ];

      if (solo?.includes("autograph-quarterly")) {
        return articulos;
      }
    }

    let profs: Profile[] = [];

    if (solo) {
      const todos = await getUnArticulo(solo?.replaceAll(/_/g, " "));

      const prof = await getDefaultProfile(
        {
          for: todos?.data?.collections?.[0]?.designer,
        },
        lensConectado?.id
      );

      articulos = [
        {
          galeria: todos?.data?.collections?.[0].collectionMetadata?.gallery,
          imagen: todos?.data?.collections?.[0].collectionMetadata?.image,
          id: todos?.data?.collections?.[0].collectionId,
          cantidad: todos?.data?.collections?.[0].amount,
          tokenes: todos?.data?.collections?.[0].acceptedTokens,
          tokenesMinteados: todos?.data?.collections?.[0].mintedTokens,
          precio: todos?.data?.collections?.[0].price,
          tipo: numberToAutograph[
            Number(todos?.data?.collections?.[0].type)
          ] as AutographType,
          titulo: todos?.data?.collections?.[0].collectionMetadata?.title,
          descripcion:
            todos?.data?.collections?.[0].collectionMetadata?.description,
          etiquetas: todos?.data?.collections?.[0].collectionMetadata?.tags,
          npcIdiomas: todos?.data?.collections?.[0].collectionMetadata?.locales,
          npcInstrucciones:
            todos?.data?.collections?.[0].collectionMetadata?.instructions,
          npcs: todos?.data?.collections?.[0].collectionMetadata?.npcs,
          pubIds: todos?.data?.collections?.[0].pubIds,
          profileIds: todos?.data?.collections?.[0].profileIds,
          coleccionId: todos?.data?.collections?.[0].collectionId,
          galeriaId: todos?.data?.collections?.[0].galleryId,
          profile: prof?.data?.defaultProfile,
        } as Coleccion,
      ];

      return articulos;
    }

    const todos = await getArticulo(first, skip);
    const designersSet: { [key: string]: boolean } = {};

    todos?.data?.collections
      ?.map((d: { designer: string }) => d.designer)
      ?.forEach((d: string) => {
        if (d) {
          designersSet[d] = true;
        }
      });

    await Promise.all(
      Object.keys(designersSet)?.map(async (d) => {
        const prof = await getDefaultProfile(
          {
            for: d,
          },
          lensConectado?.id
        );

        profs.push(prof.data?.defaultProfile as Profile);
      })
    );

    await Promise.all(
      todos?.data?.collections?.map(async (col: any) => {
        if (!col.collectionMetadata) {
          const cadena = await fetch(
            `${INFURA_GATEWAY}/ipfs/${col.uri.split("ipfs://")?.[1]}`
          );
          col.collectionMetadata = await cadena.json();
        }

        articulos?.push({
          galeria: col.collectionMetadata?.gallery,
          imagen: col.collectionMetadata?.image,
          id: col.collectionId,
          cantidad: col.amount,
          tokenes: col.acceptedTokens,
          tokenesMinteados: col.mintedTokens,
          precio: col.price,
          tipo: numberToAutograph[Number(col.type)] as AutographType,
          titulo: col.collectionMetadata?.title,
          descripcion: col.collectionMetadata?.description,
          etiquetas: col.collectionMetadata?.tags,
          npcIdiomas: col.collectionMetadata?.locales,
          npcInstrucciones: col.collectionMetadata?.instructions,
          npcs: col.collectionMetadata?.npcs,
          pubIds: col.pubIds,
          profileIds: col.profileIds,
          coleccionId: col.collectionId,
          galeriaId: col.galleryId,
          profile: profs.find(
            (prof) =>
              prof.ownedBy?.address?.toLowerCase() ==
              col.designer?.toLowerCase()
          ),
        } as Coleccion);
      })
    );

    return articulos;
  } catch (err: any) {
    console.error(err.message);
  }
};
