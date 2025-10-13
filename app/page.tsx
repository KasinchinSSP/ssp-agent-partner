import { Suspense } from "react";
import HomeClient from "./home-client";

export default function Page() {
  return (
    <Suspense>
      <HomeClient />
    </Suspense>
  );
}
