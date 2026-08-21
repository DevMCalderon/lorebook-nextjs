import Link from "next/link";

type Props = {
  href?: string;
  label?: string;
};

export function BackLink({ href = "/", label = "Back to my entities" }: Props) {
  return (
    <Link href={href} className="text-gray-500 hover:underline">
      ← {label}
    </Link>
  );
}
