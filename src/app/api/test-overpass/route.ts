import https from "https";

export async function GET() {
    const query = `
[out:json][timeout:10];
way(around:500,18.9414186,72.8354328)
[tourism=attraction][name];
out center tags;
`;

    const url =
        "https://overpass-api.de/api/interpreter?data=" +
        encodeURIComponent(query);

    console.log("[TEST] Calling Overpass directly");
    console.log("[TEST] URL:", url);

    return new Promise<Response>((resolve) => {
        const request = https.get(
            url,
            {
                headers: {
                    Accept: "application/json",
                    "User-Agent":
                        "FairTrip/1.0 (SIH prototype)",
                },

                timeout: 15000,
            },
            (response) => {
                let body = "";

                response.on("data", (chunk) => {
                    body += chunk;
                });

                response.on("end", () => {
                    console.log(
                        "[TEST] Status:",
                        response.statusCode,
                    );

                    console.log(
                        "[TEST] Body:",
                        body.slice(0, 2000),
                    );

                    resolve(
                        Response.json(
                            {
                                status:
                                    response.statusCode,
                                body: JSON.parse(body),
                            },
                            {
                                status:
                                    response.statusCode ?? 500,
                            },
                        ),
                    );
                });
            },
        );

        request.on("timeout", () => {
            console.error(
                "[TEST] HTTPS request timed out",
            );

            request.destroy();

            resolve(
                Response.json(
                    {
                        error:
                            "Node HTTPS request timed out",
                    },
                    {
                        status: 504,
                    },
                ),
            );
        });

        request.on("error", (error) => {
            console.error(
                "[TEST] HTTPS request failed:",
                error,
            );

            resolve(
                Response.json(
                    {
                        error: error.message,
                        code:
                            (error as NodeJS.ErrnoException)
                                .code,
                    },
                    {
                        status: 500,
                    },
                ),
            );
        });
    });
}