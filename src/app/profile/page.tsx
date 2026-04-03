import { auth } from "@/auth";
import { ProfileClient } from "@/components/ProfileClient";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await auth();

  // Uncomment kód ak chceme prísne zakázať prístup len pre prihlásených.
  // Pre demonštračné účely (mock profile), ho však nezakazujeme.
  // Ak nie je session, pošleme null a ProfileClient použije mock dáta.

  return (
    <ProfileClient user={session?.user} />
  );
}
