import StoreOrdersManagement from "@/modules/store/orders/store-orders";
import { Suspense } from "react";

async function Page(props: { params: Promise<{ store_id: string }> }) {
  const { store_id } = await props.params;
  return (
    <Suspense fallback={`My Products`}>
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <StoreOrdersManagement storeId={store_id} />
        </div>
      </div>
    </Suspense>
  );
}

export default Page;
