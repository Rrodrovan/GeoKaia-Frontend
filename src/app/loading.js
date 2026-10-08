import { LoaderAleatorio } from "@/components/loaders";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[3000] overflow-y-auto">
      <LoaderAleatorio />
    </div>
  );
}