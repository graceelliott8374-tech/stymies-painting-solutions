import { useEffect } from "react";

/**
 * Updates document title + meta description on route/page load.
 * No react-helmet needed.
 */
export default function useSEO({
  title,
  description,
  canonicalPath, // optional like "/services"
} = {}) {
  useEffect(() => {
    if (title) document.title = title;

    if (description) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "description");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", description);
    }

    // Optional: update canonical link if present
    if (canonicalPath) {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }

      // If you set a real domain later, we’ll update this.
      // For now, this keeps it consistent in dev.
      const origin =
        window.location.origin || "https://www.stymiespaintingsolutions.com";
      link.setAttribute("href", origin + canonicalPath);
    }
  }, [title, description, canonicalPath]);
}
