if(process.env.NODE_ENV === "production") throw new Error("Local mode is not allowed in production.");
process.env.API_EMBEDDED_DB="1";
await import("./index.js");
