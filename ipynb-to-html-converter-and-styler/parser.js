import { readFile, writeFile } from "fs/promises";
import { nanoid } from "nanoid";
import { JSDOM } from "jsdom";
// parses and converts jupyter notebooks to html allowing custom css styling for notebooks 
// was too lazy to copy paste the code
const notebookSourcePath = "../proj-nb.ipynb";
const outputHtmlPath = "../index.html";
async function main() {
    const content = await readFile(notebookSourcePath, { encoding: "utf-8" });
    const __json = JSON.parse(content);
    const cells = [];
    const htmlArray = [];
    for (const cell of __json["cells"]) {
        const data = getDataOfCell(cell);
        cells.push(data);
        // console.log(data)
    }
    for (const cell of cells) {
        if (cell.cell_type == "code") {
            const outputsHTML = [];
            if (cell.outputs != undefined) {
                for (const output of cell.outputs) {
                    if (output.type == "text") {
                        outputsHTML.push(`<pre>${output.content}</pre>`);
                    }
                    else if (output.type == "image") {
                        const id = nanoid(5);
                        outputsHTML.push(`<div id="${id}"><img class="image" src="data:image/png;base64,${output.dataUrl}" data-parent-id="${id}"></div>`);
                    }
                }
            }
            htmlArray.push(`<div class="cell"><pre class="language-python"><code class="language-python">${sanitizeHTML(cell.text)}</code></pre><div class="output">${outputsHTML.join('')}</div></div>`);
        }
        else if (cell.cell_type == "html") {
            htmlArray.push(`<div class="cell">${cell.userHtml}</div>`);
        }
    }
    const template = await readFile("template.html", { encoding: "utf-8" });
    const domTree = (new JSDOM(template)).window.document;
    const mainElm = domTree.querySelector("main");
    mainElm.innerHTML = htmlArray.join('');
    const finalHtml = domTree.documentElement.outerHTML;
    await writeFile(outputHtmlPath, finalHtml);
    console.log("file written at " + outputHtmlPath);
}
// 
function getDataOfCell(cellObj) {
    let content;
    let cell_type;
    let outputs = [];
    let userHtml;
    if (cellObj.metadata.vscode?.languageId == "html") {
        userHtml = cellObj.source?.filter(ln => ln.trim() != "%%script false --no-raise-error")?.join('') || "EMPTY";
        cell_type = "html";
    }
    else if (cellObj.cell_type == "code") {
        cell_type = "code";
        content = cellObj.source?.join('') || 'EMPTY';
        if (cellObj.outputs?.length != undefined && cellObj.outputs.length > 0) {
            for (const __output of cellObj.outputs) {
                if (__output.output_type == "stream") {
                    console.log("* Found Text output");
                    const content = __output.text?.join("") || "EMPTY";
                    outputs.push({
                        "type": "text",
                        content
                    });
                }
                else if (__output.output_type == "display_data") {
                    console.log("* Found image");
                    outputs.push({
                        type: "image",
                        dataUrl: __output.data?.["image/png"] //assuming all images would be pngs
                    });
                }
            }
        }
    }
    return {
        outputs,
        cell_type,
        text: content,
        userHtml
    };
}
// 
function sanitizeHTML(__string) {
    return __string
        .replace('&', "&amp;")
        .replace('<', "&lt;")
        .replace('>', "&gt;")
        .replace('"', "&quot;")
        .replace("'", "&#39;");
}
// 
main().catch(console.log);
