import { Suspense } from "react";
import { OrderView } from "@/components/shop/OrderView";

export const metadata = { title: "Your order" };

export default async function OrderPage(props: PageProps<"/order/[id]">) {
  const { id } = await props.params;
  return (
    <Suspense>
      <OrderView id={decodeURIComponent(id)} />
    </Suspense>
  );
}
