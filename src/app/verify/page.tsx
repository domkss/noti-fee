import { getNotificationDataFromJWT } from "@/lib/service/NotificationHandler";
import { getErrorMessage } from "@/lib/utility/UtilityFunctions";

async function VerifyPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  let token = searchParams ? searchParams["token"] : null;

  if (token && typeof token === "string") {
    try {
      let decoded = await getNotificationDataFromJWT(token);
      return <div>{decoded.email}</div>;
    } catch (e) {
      return <div>{getErrorMessage(e)}</div>;
    }
  } else {
    return <div>No token provided</div>;
  }
}

export default VerifyPage;
