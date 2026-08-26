import type { ParsedSearchQuery, SearchIntent,} from "../types";
import { normalizeQuery,} from "../utils/normalizeQuery";

function detectIntent( query: string,): SearchIntent {
    if (/\b(vadapav|food|eat|restaurant|cafe|breakfast|lunch|dinner|seafood)\b/.test( query,)) {
        return "food_search";
    }

    if (/\b(uber|rapido|auto|taxi|cab|bus|metro|travel fare|transport)\b/.test( query, )) {
        return "transport_price";
    }

    if ( /\b(where can i go|places to visit|nearby places|near me|visit|explore)\b/.test( query,)) {
        return "destination_recommendation";
    }

    if (/\b(how much|cost|budget|spend|expense)\b/.test( query,)) {
        return "trip_cost";
    }
    return "place_search";
}

function detectPricePreference(query: string,): ParsedSearchQuery["pricePreference"] {
    if (/\b(cheap|cheapest|low cost|budget|affordable)\b/.test(query,)) {
        return "cheap";
    }

    if (/\b(fair|reasonable|normal|usual|local price)\b/.test(query,)) {
        return "fair";
    }
    return "any";
}

function detectPreferences(query: string) {
    return {
        spicy: /\b(spicy|hot|tikha)\b/.test(query,),
        vegetarian: /\b(veg|vegetarian)\b/.test(query,),
        seafood: /\b(seafood|fish|prawns|prawn)\b/.test(query,),
        famous: /\b(famous|popular|must try)\b/.test(query,),
        cheap: /\b(cheap|budget|affordable)\b/.test(query,),
        highlyRated: /\b(best|top|highly rated|rating)\b/.test(query,),
    };
}

function detectBudget(query: string,): number | undefined {
    const match = query.match(/(?:₹|rs\.?|rupees?)\s*(\d+(?:,\d+)*)/i,);

    if (!match) {
        return undefined;
    }

    return Number(
        match[1].replace(/,/g, ""),
    );
}

function detectTransport(query: string,): ParsedSearchQuery["transport"] {
    if (/\brapido\b/.test(query)) {
        return "rapido";
    }

    if (/\buber\b/.test(query)) {
        return "uber";
    }

    if (/\b(auto|local auto|rickshaw)\b/.test(query,)) {
        return "local";
    }

    if (/\bwalk|walking\b/.test(query)) {
        return "walk";
    }
    return undefined;
}

export function understandQuery(originalQuery: string,): ParsedSearchQuery {
    const normalizedQuery = normalizeQuery(originalQuery,);
    const intent = detectIntent(normalizedQuery,);
    const pricePreference = detectPricePreference(normalizedQuery,);
    const preferences = detectPreferences(normalizedQuery,);
    const budget = detectBudget(normalizedQuery,);
    const transport = detectTransport(normalizedQuery,);

    return {
        originalQuery,
        normalizedQuery,
        intent,
        location: {
            type: "unknown",
        },
        budget,
        transport,
        pricePreference,
        preferences,
        confidence:
            intent === "place_search"
                ? 0.55
                : 0.85,
    };
}