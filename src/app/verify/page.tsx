import SetupVerificationForm from "@/components/view/SetupVerificationForm";
import { getNotificationDataFromJWT } from "@/lib/service/NotificationHandler";
import PrismaInstance from "@/lib/service/PrismaInstance";
import { getErrorMessage } from "@/lib/utility/UtilityFunctions";
import { redirect } from "next/navigation";

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
      let prisma = await PrismaInstance.getInstance();
      let user = await prisma.user.findUnique({ where: { email: decoded.email } });

      return <SetupVerificationForm data={decoded} availableCredit={user?.credit ?? 0} />;
    } catch (e) {
      return <div>{getErrorMessage(e)}</div>;
    }
  } else {
    redirect("/");
  }
}

export default VerifyPage;
