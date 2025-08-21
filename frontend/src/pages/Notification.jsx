import { getNotifications } from "../api";
import NotificationList from "../components/Notifications/NotificationList";
import { useQuery } from "@tanstack/react-query";

export default function Notifications() {
  const { data: notifications, isLoading, isError} = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
    refetchInterval: 10000,
    // staleTime: 30000,
    
  })

  return <NotificationList notifications={notifications} isLoading={isLoading} isError={isError} />;
}