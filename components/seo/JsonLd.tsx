export function JsonLd({ data }: { data: object }) {
  // JSON.stringify does not escape `<`, so CMS text containing `</script>` would
  // break out of this block. `<` is a valid JSON escape and renders identically.
  const json = JSON.stringify(data).replace(/</g, '\\u003c');

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
