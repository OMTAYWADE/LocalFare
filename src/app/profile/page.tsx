import { redirect   } from "next/navigation";

import { auth } from "../../../auth";
import { prisma } from "@/lib/prisma";
import TravelMemoryProfile from "@/features/profile/components/TravelMemoryProfile";

export const runtime = "nodejs";

export default async function ProfilePage() {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        redirect("/auth/signin?callbackUrl=/profile");
    }

    const [user, journeyCount, visitedPlaceCount, savedPlaceCount, foodScanCount, searchCount] =
        await Promise.all([
            prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    createdAt: true,
                    profile: {
                        select: {
                            travelerType: true,
                            currency: true,
                            vegetarian: true,
                            vegan: true,
                            preferredSpice: true,
                            preferredCuisine: true,
                        },
                    },
                    trips: {
                        orderBy: { updatedAt: "desc" },
                        take: 8,
                        select: {
                            id: true,
                            name: true,
                            status: true,
                            sourceCount: true,
                            placeCount: true,
                            routeCount: true,
                            expenseCount: true,
                            totalKnownSpendInr: true,
                            startDate: true,
                            endDate: true,
                            createdAt: true,
                            updatedAt: true,
                        },
                    },
                    visitedPlaces: {
                        orderBy: { visitedAt: "desc" },
                        take: 10,
                        select: {
                            id: true,
                            visitedAt: true,
                            note: true,
                            place: {
                                select: {
                                    id: true,
                                    name: true,
                                    type: true,
                                    address: true,
                                    city: true,
                                    state: true,
                                    country: true,
                                    imageUrl: true,
                                },
                            },
                        },
                    },
                    savedPlaces: {
                        orderBy: { createdAt: "desc" },
                        take: 8,
                        select: {
                            id: true,
                            createdAt: true,
                            place: {
                                select: {
                                    id: true,
                                    name: true,
                                    type: true,
                                    address: true,
                                    city: true,
                                    state: true,
                                    country: true,
                                    imageUrl: true,
                                },
                            },
                        },
                    },
                    foodScans: {
                        orderBy: { createdAt: "desc" },
                        take: 10,
                        select: {
                            id: true,
                            recognizedName: true,
                            confidence: true,
                            imageUrl: true,
                            mode: true,
                            source: true,
                            createdAt: true,
                            food: {
                                select: {
                                    id: true,
                                    name: true,
                                    imageUrl: true,
                                    cuisine: true,
                                    spiceLevel: true,
                                },
                            },
                        },
                    },
                    searchHistory: {
                        orderBy: { createdAt: "desc" },
                        take: 10,
                        select: {
                            id: true,
                            query: true,
                            locationQuery: true,
                            travelerType: true,
                            createdAt: true,
                        },
                    },
                },
            }),
            prisma.trip.count({ where: { userId } }),
            prisma.visitedPlace.count({ where: { userId } }),
            prisma.savedPlace.count({ where: { userId } }),
            prisma.foodScan.count({ where: { userId } }),
            prisma.searchHistory.count({ where: { userId } }),
        ]);

    if (!user) {
        redirect("/auth/signin?callbackUrl=/profile");
    }

    const payload = {
        profile: {
            id: user.id,
            name: user.name ?? "FairTrip traveler",
            email: user.email ?? "",
            createdAt: user.createdAt.toISOString(),
            travelerType: user.profile?.travelerType ?? "TOURIST",
            currency: user.profile?.currency ?? "INR",
            vegetarian: user.profile?.vegetarian ?? false,
            vegan: user.profile?.vegan ?? false,
            preferredSpice: user.profile?.preferredSpice ?? null,
            preferredCuisine: user.profile?.preferredCuisine ?? null,
        },
        stats: {
            journeys: journeyCount,
            placesVisited: visitedPlaceCount,
            savedPlaces: savedPlaceCount,
            foodScans: foodScanCount,
            searches: searchCount,
            knownSpend: user.trips.reduce(
                (sum, trip) => sum + trip.totalKnownSpendInr,
                0,
            ),
        },
        journeys: user.trips.map((trip) => ({
            ...trip,
            startDate: trip.startDate?.toISOString() ?? null,
            endDate: trip.endDate?.toISOString() ?? null,
            createdAt: trip.createdAt.toISOString(),
            updatedAt: trip.updatedAt.toISOString(),
        })),
        visitedPlaces: user.visitedPlaces.map((item) => ({
            ...item,
            visitedAt: item.visitedAt.toISOString(),
        })),
        savedPlaces: user.savedPlaces.map((item) => ({
            ...item,
            createdAt: item.createdAt.toISOString(),
        })),
        foodScans: user.foodScans.map((item) => ({
            ...item,
            createdAt: item.createdAt.toISOString(),
        })),
        searchHistory: user.searchHistory.map((item) => ({
            ...item,
            createdAt: item.createdAt.toISOString(),
        })),
    };

    return <TravelMemoryProfile data={payload} />;
}
