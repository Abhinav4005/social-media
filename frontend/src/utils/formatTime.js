export function formatTime(dateString) {
   const date = new Date(dateString);
   const now = new Date();

   const diffInMs = now - date;
   const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24 ));
   const diffInHours = Math.floor((diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60 ));
   const diffInMinutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));

//    if (diffInDays > 0 ){
//     return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
//    }
//    if(diffInHours > 0) {
//     return `${diffInHours} hours ago`;
//    }

   if (diffInDays <= 7 ){
    return date.toLocaleString('en-US', {
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
   } else {
    return date.toLocaleString("en-US", {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    })
   }
}