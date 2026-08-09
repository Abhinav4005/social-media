import { getNotifications } from "../../../api";
import NotificationList from "../components/NotificationList";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../../constant/queryKeys";

export default function NotificationPage() {
  const { data: notifications, isLoading, isError } = useQuery({
    queryKey: QUERY_KEYS.notifications,
    queryFn: getNotifications,
    refetchInterval: 10000,
  });

  return <NotificationList notifications={notifications} isLoading={isLoading} isError={isError} />;
}
