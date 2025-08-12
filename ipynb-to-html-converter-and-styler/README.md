Simple script to convert jupyter notebooks into editable & stylable html documents

Generated html document contains
* Python Code cells
* Cell outputs
* Generated pngs (through matplotlib)
* HTML Cells


# Usage

Cell outputs would only be visible in the final html if they exist in the notebook.

1. `Run All` cells of notebook
2. Transpile and run `parser.js`. Ensure correct paths inside it.

Parser uses `template.html` as basic template for the page and generated html is put within the `<main>` element of template.


> All markdown cells are ignored, to add text, use html cells with first line as "%%script false --no-raise-error" and everything else using html.