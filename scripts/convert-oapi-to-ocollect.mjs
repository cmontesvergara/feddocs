#!/usr/bin/env node

import fs from "fs";
import yaml from "js-yaml";
import path from "path";

const inputFile = process.argv[2] || path.join("docs", "playground", "openapi.yaml");
const outputFile = process.argv[3] || path.join(path.dirname(inputFile), "collection.yaml");

if (!fs.existsSync(inputFile)) {
    console.error("Usage: node convert-oapi-to-ocollect.mjs <openapi-file> [output-file]");
    process.exit(1);
}

const raw = fs.readFileSync(inputFile, "utf8");

let openapi;
if (inputFile.endsWith(".yaml") || inputFile.endsWith(".yml")) {
    openapi = yaml.load(raw);
} else {
    openapi = JSON.parse(raw);
}

const baseUrl =
    openapi.servers?.[0]?.url || "http://localhost:3000";

const items = [];

let seq = 1;

for (const [route, methods] of Object.entries(openapi.paths)) {
    for (const [method, spec] of Object.entries(methods)) {
        const name =
            spec.summary ||
            spec.operationId ||
            `${method.toUpperCase()} ${route}`;

        let body = undefined;

        if (spec.requestBody?.content?.["application/json"]?.example) {
            body = JSON.stringify(
                spec.requestBody.content["application/json"].example,
                null,
                2
            );
        }

        const headers = [];

        if (spec.requestBody) {
            headers.push({
                name: "Content-Type",
                value: "application/json",
            });
        }

        const item = {
            info: {
                name,
                type: "http",
                seq: seq++,
            },
            http: {
                method: method.toUpperCase(),
                url: `{{baseUrl}}${route}`,
            },
            settings: {
                encodeUrl: false,
                timeout: 0,
                followRedirects: true,
                maxRedirects: 5,
            },
        };

        if (headers.length) {
            item.http.headers = headers;
        }

        if (body) {
            item.http.body = {
                type: "json",
                data: body,
            };
        }

        items.push(item);
    }
}

// --- info ---
const info = {
    name: openapi.info?.title || "API",
};

if (openapi.info?.description) {
    info.summary = openapi.info.description.split("\n")[0].trim();
}

if (openapi.info?.version) {
    info.version = openapi.info.version;
}

if (openapi.info?.contact) {
    const author = {};
    if (openapi.info.contact.name) author.name = openapi.info.contact.name;
    if (openapi.info.contact.email) author.email = openapi.info.contact.email;
    if (openapi.info.contact.url) author.url = openapi.info.contact.url;
    if (Object.keys(author).length) {
        info.authors = [author];
    }
}

// --- docs (full description from OpenAPI) ---
const docs = openapi.info?.description || null;

// --- environments ---
const environments = [];
if (openapi.servers && openapi.servers.length > 0) {
    openapi.servers.forEach((server, index) => {
        environments.push({
            name: server.description ? server.description.split(' ')[0].toLowerCase() : `env-${index + 1}`,
            variables: [
                {
                    name: "baseUrl",
                    value: server.url,
                },
            ],
        });
    });
} else {
    // Fallback if no servers defined
    environments.push({
        name: "local",
        variables: [
            {
                name: "baseUrl",
                value: "http://localhost:3000",
            },
        ],
    });
}

const collection = {
    opencollection: "1.0.0",
    info,
    ...(docs ? { docs } : {}),
    config: {
        environments,
    },
    items,
    bundled: true,
};

const outputYaml = yaml.dump(collection, {
    lineWidth: -1,
});

fs.writeFileSync(outputFile, outputYaml);

console.log(`OpenCollection generated: ${outputFile}`);