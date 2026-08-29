import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  href?: string;
  label?: string;
};

export function BackLink({ href = "/", label = "Go back" }: Props) {
  return (
    <Button
      variant="ghost"
      size="default"
      nativeButton={false}
      render={
        <Link href={href}>
          <ArrowLeft className="size-4" />
          {label}
        </Link>
      }
    ></Button>
  );
}
