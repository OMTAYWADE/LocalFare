import MenuScanResults from "@/features/food/components/MenuScanResults";

interface MenuPageProps {
    searchParams: Promise<{
        items?: string;
        latitude?: string;
        longitude?: string;
    }>;
}

export default async function MenuPage({
    searchParams,
}: MenuPageProps) {
    const params = await searchParams;

    return (
        <MenuScanResults
            items={params.items ?? ""}
            latitude={params.latitude}
            longitude={params.longitude}
        />
    );
}
