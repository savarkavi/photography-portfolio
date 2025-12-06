import type { StructureResolver } from "sanity/structure";

// https://www.sanity.io/docs/structure-builder-cheat-sheet

const singletonTypes = new Set(["featuredProjects"]);
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Featured Projects")
        .id("featured")
        .child(
          S.document().schemaType("featuredProjects").documentId("featured"),
        ),

      S.divider(),

      ...S.documentTypeListItems().filter((listItem) => {
        const id = listItem.getId();
        if (!id) {
          return true;
        }

        return !singletonTypes.has(id);
      }),
    ]);
