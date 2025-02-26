import { getTexts } from "@/actions/get-texts";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { CopyToClipboard } from "@/components/ui/copy-to-clipboard";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
export default async function CodePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const code = (await params).code;

  const res = await getTexts(code);

  if (res.errorTitle === "INVALID_CODE" || !res.data) {
    return (
      <ErrorMessage
        variant="error"
        title="Code not found"
        message="Make sure the share code is valid."
      />
    );
  }

  // Check if code is expired
  if (res.errorTitle === "CODE_EXPIRED") {
    return (
      <ErrorMessage
        variant="error"
        title="Code expired"
        message="The code has already expired! Please try a new one."
      />
    );
  }

  // Fetch texts
  if (res.errorTitle === "NO_TEXTS_FOUND") {
    return (
      <ErrorMessage
        variant="warning"
        title="No texts found"
        message="Please make sure the share code is valid and not expired."
      />
    );
  }

  // Render texts
  return (
    <div className="w-full">
      <div className="w-full flex justify-center mx-auto">
        <Link href="/">
          <Button variant={"outline"}>Share new Text</Button>
        </Link>
      </div>
      <p className="text-sm text-right">
        Expires in: {formatDistanceToNow(res.data.expiresAt)}
      </p>
      <div className="flex flex-col gap-2">
        {res.data.texts.map((text) => (
          <div key={text} className="relative">
            <Textarea
              readOnly
              value={text}
              className="resize-none rounded-lg bg-white p-4 min-h-[350px]"
            />
            <CopyToClipboard text={text} />
          </div>
        ))}
      </div>
    </div>
  );
}
const ErrorMessage = ({
  variant,
  title,
  message,
}: {
  variant: "error" | "warning";
  title: React.ReactNode;
  message: string;
}) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <Callout variant={variant} heading={title}>
        {message}
      </Callout>
      <Link href="/">
        <Button>Share new text</Button>
      </Link>
    </div>
  );
};
