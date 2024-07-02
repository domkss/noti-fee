import "server-only";
import InternalErrorView from "@/components/view/ClientErrorViews/InternalErrorView";
import LinkExpiredView from "@/components/view/ClientErrorViews/LinkExpiredView";
import SetupVerificationForm from "@/components/view/SetupVerificationForm";
import { getNotificationDataFromJWT } from "@/lib/service/NotificationHandler";
import PrismaInstance from "@/lib/service/PrismaInstance";
import Logger from "@/lib/utility/Logger";
import { getErrorMessage } from "@/lib/utility/UtilityFunctions";
import { redirect } from "next/navigation";

async function VerifyPage({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
  let token = searchParams ? searchParams["token"] : null;

  if (token && typeof token === "string") {
    try {
      let decoded = await getNotificationDataFromJWT(token);
      let prisma = await PrismaInstance.getInstance();
      let user = await prisma.user.findUnique({ where: { email: decoded.email }, include: { notifications: true } });

      return (
        <SetupVerificationForm
          data={decoded}
          availableCredit={user?.credit ?? 0}
          notificationJWT={token}
          activated={user?.notifications.some((n) => n.id === decoded.uuid) ?? false}
        />
      );
    } catch (e) {
      if (getErrorMessage(e) === "Token has expired" || getErrorMessage(e) === "Invalid token") {
        return <LinkExpiredView />;
      } else {
        Logger.error({ message: "Error in VerifyPage", data: getErrorMessage(e) });
      }
      return <InternalErrorView />;
    }
  } else {
    redirect("/");
  }
}

export default VerifyPage;
