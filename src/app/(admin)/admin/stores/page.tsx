import { StoreManagement } from "@/modules/admin/stores/StoreManagement";

// Force dynamic rendering for this page
export const dynamic = "force-dynamic";

/**
 * Admin Stores Page
 * Store management interface for administrators
 */
export default function AdminStoresPage() {
  return <StoreManagement />;
}
