import { Badge } from "@/common/Badge/Badge";
import { classNames } from "@/utils/classnames";
import { t } from "@lingui/macro";

export const CardStatusBadge = ({ status }) => {
  const isRed = [t`Incident Happened`, t`Claimable`].includes(status);

  if (!status || status == "Normal") {
    return null;
  }

  return (
    <Badge
      className={classNames(isRed && "text-FA5C2F", !isRed && "text-21AD8C")}
    >
      {status}
    </Badge>
  );
};
