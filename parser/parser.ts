import { readFile, writeFile } from "fs/promises"


// parses and converts jupyter notebooks to html
// was too lazy to copy paste the code


async function main() {
    const content = await readFile("../nb1.json", { encoding: "utf-8" });
    const __json = JSON.parse(content);

    const cells = [];
    const htmlArray = []

    for (const cell of __json["cells"]) {
        const data = getDataOfCell(cell)
        cells.push(data);
        // console.log(data)
    }

    for (const cell of cells) {
        if (cell.cell_type == "code") {
            const outputsHTML = []
            if(cell.outputs != undefined){
                for(const output of cell.outputs){
                    if(output.type == "text"){
                        outputsHTML.push(output.content);
                    }
                }
            }
            
            
            htmlArray.push(`
                <div class="cell">
                <pre class="language-python">
                <code class="language-python">
${cell.text}
                </code>
                </pre>
                <div class="output">
                <pre>
${outputsHTML.join('')}
                </pre>
                </div>
                `)
        }
    }

    
    await writeFile("out.html", htmlArray.join(''));
    

}


// 

function getDataOfCell(cellObj: Cell): SimplifiedCellData {
    let content;
    let cell_type;
    let outputs = [];

    if (cellObj.cell_type == "code") {
        cell_type = "code";
        content = cellObj.source?.join('') || 'EMPTY';

        if (cellObj.outputs?.length != undefined && cellObj.outputs.length > 0) {
            for (const __output of cellObj.outputs) {
                if (__output.output_type == "stream") {
                    console.log("* Found Text output");
                    const content = __output.text?.join("") || "EMPTY"
                    outputs.push({
                        "type": "text",
                        content
                    })
                }
            }
        }

    }
    else {
        cell_type = "markdown";
        content = cellObj.source?.join('') || 'EMPTY'
    }
    return {
        outputs,
        cell_type,
        text: content
    } as SimplifiedCellData
}



// 
main().catch(console.log);

type SimplifiedCellData = {
    "cell_type": "markdown" | "code" | "output",
    "text": String,
    "outputs": Array<{
        "type": "text" | "image",
        "content": String
    }>
}

type Cell = {
    "id": string,
    "cell_type": "markdown" | "code",
    "outputs"?: Array<{
        "output_type": "display_data" | "stream",
        "text"?: Array<string>
    }>,
    "source"?: Array<string>
}


