import { getTexts } from "@/actions/get-texts";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { CopyToClipboard } from "@/components/ui/copy-to-clipboard";
import { Textarea } from "@/components/ui/textarea";
import { CodeRepository } from "@/repository/code-repository";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
export default async function CodePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const code = (await params).code;

  // Fetch code data
  const codeData = await CodeRepository.find(code);
  if (!codeData) {
    return (
      <ErrorMessage
        variant="error"
        title="Code not found"
        message="Make sure the share code is valid."
      />
    );
  }

  // Check if code is expired
  if (codeData.expiresAt < new Date()) {
    return (
      <ErrorMessage
        variant="error"
        title="Code expired"
        message="The code has already expired! Please try a new one."
      />
    );
  }

  // Fetch texts
  const texts = await getTexts({ code });
  if (!texts?.data?.length) {
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
    <div>
      <p className="text-sm text-right">
        Expires in: {formatDistanceToNow(codeData.expiresAt)}
      </p>
      <div className="flex flex-col gap-2">
        {texts.data.map((text) => (
          <div key={text.id} className="relative">
            <Textarea
              readOnly
              value={text.content}
              className="resize-none rounded-lg bg-white p-4 min-h-[350px]"
            />
            <CopyToClipboard text={text.content} />
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
