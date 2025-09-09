import { apiClient } from "@/lib/apiClient"

export const dashboardService ={
    getTenantDashboardSummary:async () => {
        const res = await apiClient.get<DashboardData>('/api/users/tenant/dashboard')
        return res
    }
}