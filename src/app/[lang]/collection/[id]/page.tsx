import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CollectionScreen from "@/screens/CollectionScreen";
import { getDictionary, resolveLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";
import {
  findCollection,
  generateCollectionStaticParams,
  getCollections,
  getProducts,
} from "@/lib/products";

export function generateStaticParams() {
  return generateCollectionStaticParams();
}

type Params = { params: Promise<{ lang: string; id: string }> };

async function load({ params }: Params) {
  const { id } = await params;
  const lang = await resolveLocale(params);
  const collection = findCollection(getCollections(await getProducts(lang), lang), id);
  return { lang, collection };
}

export async function generateMetadata(props: Params): Promise<Metadata> {
  const { lang, collection } = await load(props);
  if (!collection) return {};

  return pageMetadata({
    lang,
    path: `collection/${collection.id}`,
    title: collection.seo.title,
    description: collection.seo.description,
    image: collection.items[0]?.images[0]?.src,
  });
}

export default async function CollectionPage(props: Params) {
  const { lang, collection } = await load(props);
  if (!collection) notFound();
  const dict = await getDictionary(lang);

  return <CollectionScreen lang={lang} dict={dict} collection={collection} />;
}
