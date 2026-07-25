/**
 * Options for the `convert` function.
 */
export interface ConvertOptions {
  /** Generate code samples from x-code-samples or templates. Default: `true`. */
  codeSamples?: boolean;
  /** Use httpsnippet to generate code samples. Default: `false`. */
  httpsnippet?: boolean;
  /** Language tabs for code samples, e.g. `[{ shell: 'Shell' }, { javascript: 'JavaScript' }]`. */
  language_tabs?: Array<Record<string, string>>;
  /** Language clients for httpsnippet, e.g. `[{ shell: 'cURL' }]`. */
  language_clients?: Array<Record<string, string>>;
  /** Syntax-highlighter theme. */
  theme?: string;
  /** Include search support in output. Default: `true`. */
  search?: boolean;
  /** Generate example values instead of raw schemas. Default: `true`. */
  sample?: boolean;
  /** Include schema.org WebAPI discovery data. */
  discovery?: boolean;
  /** Number of heading levels in the table of contents. Default: `2`. */
  headings?: number;
  /** Use operation summary as the TOC entry instead of the ID. */
  tocSummary?: boolean;
  /** When referring to a schema with a $ref, don't show the full contents. */
  shallowSchemas?: boolean;
  /** Expand the schema and show all properties in the request body. */
  expandBody?: boolean;
  /** Maximum depth to show for schema examples. Default: `10`. */
  maxDepth?: number;
  /** Display JSON schemas in YAML format. */
  yaml?: boolean;
  /** Resolve external $refs. */
  resolve?: boolean;
  /** Source file path (used for relative path resolution). */
  source?: string;
  /** List of files to put in the `include` header of the output. */
  includes?: string[];
  /** Directory to load override templates from. */
  user_templates?: string;
  /** Custom template callback: `(templateName, stage, data) => data`. */
  templateCallback?: (templateName: string, stage: string, data: any) => any;
  /** Footer links for the table of contents. */
  toc_footers?: Array<{ url: string; description: string }>;
  /** Include clipboard support. Default: `true`. */
  clipboard?: boolean;
  /** Custom API key value for code examples. */
  customApiKeyValue?: string;
  /** Omit the body parameter from the parameters table. */
  omitBody?: boolean;
  /** Omit the YAML front-matter header in the output. */
  omitHeader?: boolean;
  /** Use the original parameter name for the OpenAPI 2.0 body parameter. */
  useBodyName?: boolean;
  /** Increase verbosity. */
  verbose?: boolean;
  /** Output raw schemas instead of example values. */
  raw?: boolean;
  /** Use httpsnippet for multipart media types. */
  experimental?: boolean;
  /** Post-process output to pure markdown: convert HTML tags to markdown, strip placeholder JSON samples. Default: `false`. */
  cleanMarkdown?: boolean;
}

/**
 * Convert an OpenAPI / Swagger / AsyncAPI / Semoasa / API Blueprint definition to Markdown or HTML.
 *
 * @param api - An API definition object (OpenAPI, Swagger, AsyncAPI, Semoasa) or an API Blueprint string.
 * @param options - Conversion options.
 * @returns A Promise resolving to the generated Markdown or HTML string.
 */
export function convert(
  api: Record<string, any> | string,
  options?: ConvertOptions
): Promise<string>;
