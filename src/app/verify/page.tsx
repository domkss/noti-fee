"use server";
import SetupVerificationForm from "@/components/view/SetupVerificationForm";
import { getNotificationDataFromJWT } from "@/lib/service/NotificationHandler";
import PrismaInstance from "@/lib/service/PrismaInstance";
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
          token={token}
          activated={user?.notifications.some((n) => n.id === decoded.uuid) ?? false}
        />
      );
    } catch (e) {
      return <div>{getErrorMessage(e)}</div>;
    }
  } else {
    redirect("/");
  }
}

export default VerifyPage;
