import { createClient } from "@prismicio/client";

export const client = createClient(process.env.PRISMIC_ENDPOINT, {
  accessToken: process.env.PRISMIC_ACCESS_TOKEN,
});
