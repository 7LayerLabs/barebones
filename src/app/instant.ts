import { init, i, id } from "@instantdb/react";

const APP_ID = "a97bc4e1-ad3b-438c-bf2b-4dfd78acf035";

const schema = i.schema({
  entities: {
    counters: i.entity({
      name: i.string().unique().indexed(),
      count: i.number(),
    }),
    visitors: i.entity({
      visitorId: i.string().unique().indexed(),
      firstSeen: i.number(),
      lastSeen: i.number(),
    }),
    breakdowns: i.entity({
      idea: i.string(),
      visitorId: i.string().indexed(),
      createdAt: i.number(),
    }),
  },
});

export const db = init({ appId: APP_ID, schema });
export { id };
export type { schema as AppSchema };
