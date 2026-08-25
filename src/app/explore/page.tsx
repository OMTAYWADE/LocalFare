import PageContainer from "@/components/layout/PageContainer";
import AppHeader from "@/components/layout/AppHeader";

import ExploreContent from "@/features/explore/components/ExploreContent";

export default function ExplorePage() {
  return (
    <>
      <AppHeader />

      <main>
        <PageContainer>
          <ExploreContent />
        </PageContainer>
      </main>
    </>
  );
}