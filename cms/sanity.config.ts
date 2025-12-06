import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./schemas";

export default defineConfig({
  name: "rotaract-tc-25-cms",
  title: "Rotaract TC 25 CMS",
  projectId: process.env.SANITY_PROJECT_ID || "7vzmidfo",
  dataset: process.env.SANITY_DATASET || "production",
  basePath: "/studio",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            // Pages Group
            S.listItem()
              .title("Pages")
              .child(
                S.list()
                  .title("Pages")
                  .items([
                    S.listItem()
                      .title("Home Page")
                      .schemaType("homePage")
                      .child(
                        S.document()
                          .schemaType("homePage")
                          .documentId("homePage")
                      ),
                    S.listItem()
                      .title("About Page")
                      .schemaType("aboutPage")
                      .child(
                        S.document()
                          .schemaType("aboutPage")
                          .documentId("aboutPage")
                      ),
                    S.listItem()
                      .title("Settings")
                      .schemaType("settings")
                      .child(
                        S.document()
                          .schemaType("settings")
                          .documentId("settings")
                      ),
                  ])
              ),
            // Content Group
            S.listItem()
              .title("Content")
              .child(
                S.list()
                  .title("Content")
                  .items([
                    S.listItem()
                      .title("Projects")
                      .schemaType("project")
                      .child(S.documentTypeList("project").title("Projects")),
                    S.listItem()
                      .title("Events")
                      .schemaType("event")
                      .child(S.documentTypeList("event").title("Events")),
                    S.listItem()
                      .title("Blog Posts")
                      .schemaType("blog")
                      .child(S.documentTypeList("blog").title("Blog Posts")),
                  ])
              ),
            // People Group
            S.listItem()
              .title("People")
              .child(
                S.list()
                  .title("People")
                  .items([
                    S.listItem()
                      .title("Leadership")
                      .schemaType("leadership")
                      .child(
                        S.documentTypeList("leadership").title("Leadership")
                      ),
                    S.listItem()
                      .title("Testimonials")
                      .schemaType("testimonial")
                      .child(
                        S.documentTypeList("testimonial").title("Testimonials")
                      ),
                  ])
              ),
            // Media Group
            S.listItem()
              .title("Media")
              .child(
                S.list()
                  .title("Media")
                  .items([
                    S.listItem()
                      .title("Gallery Images")
                      .schemaType("galleryImage")
                      .child(
                        S.documentTypeList("galleryImage").title(
                          "Gallery Images"
                        )
                      ),
                    S.listItem()
                      .title("Partners")
                      .schemaType("partner")
                      .child(S.documentTypeList("partner").title("Partners")),
                  ])
              ),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
});
