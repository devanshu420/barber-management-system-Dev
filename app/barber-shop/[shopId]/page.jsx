import ShopDetailClient from "../ShopDetailClient";

export default async function Page({ params }) {
  const { shopId } = await params;
  return <ShopDetailClient shopId={shopId} />;
}

