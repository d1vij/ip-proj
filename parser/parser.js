"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var promises_1 = require("fs/promises");
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var content, __json, cells, htmlArray, _i, _a, cell, data, _b, cells_1, cell, outputsHTML, _c, _d, output;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, (0, promises_1.readFile)("../nb1.json", { encoding: "utf-8" })];
                case 1:
                    content = _e.sent();
                    __json = JSON.parse(content);
                    cells = [];
                    htmlArray = [];
                    for (_i = 0, _a = __json["cells"]; _i < _a.length; _i++) {
                        cell = _a[_i];
                        data = getDataOfCell(cell);
                        cells.push(data);
                        // console.log(data)
                    }
                    for (_b = 0, cells_1 = cells; _b < cells_1.length; _b++) {
                        cell = cells_1[_b];
                        if (cell.cell_type == "code") {
                            outputsHTML = [];
                            if (cell.outputs != undefined) {
                                for (_c = 0, _d = cell.outputs; _c < _d.length; _c++) {
                                    output = _d[_c];
                                    if (output.type == "text") {
                                        outputsHTML.push(output.content);
                                    }
                                }
                            }
                            htmlArray.push("\n                <div class=\"cell\">\n                <pre class=\"language-python\">\n                <code class=\"language-python\">\n".concat(cell.text, "\n                </code>\n                </pre>\n                <div class=\"output\">\n                <pre>\n").concat(outputsHTML.join(''), "\n                </pre>\n                </div>\n                "));
                        }
                    }
                    return [4 /*yield*/, (0, promises_1.writeFile)("out.html", htmlArray.join(''))];
                case 2:
                    _e.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// 
function getDataOfCell(cellObj) {
    var _a, _b, _c, _d;
    var content;
    var cell_type;
    var outputs = [];
    if (cellObj.cell_type == "code") {
        cell_type = "code";
        content = ((_a = cellObj.source) === null || _a === void 0 ? void 0 : _a.join('')) || 'EMPTY';
        if (((_b = cellObj.outputs) === null || _b === void 0 ? void 0 : _b.length) != undefined && cellObj.outputs.length > 0) {
            for (var _i = 0, _e = cellObj.outputs; _i < _e.length; _i++) {
                var __output = _e[_i];
                if (__output.output_type == "stream") {
                    console.log("* Found Text output");
                    var content_1 = ((_c = __output.text) === null || _c === void 0 ? void 0 : _c.join("")) || "EMPTY";
                    outputs.push({
                        "type": "text",
                        content: content_1
                    });
                }
            }
        }
    }
    else {
        cell_type = "markdown";
        content = ((_d = cellObj.source) === null || _d === void 0 ? void 0 : _d.join('')) || 'EMPTY';
    }
    return {
        outputs: outputs,
        cell_type: cell_type,
        text: content
    };
}
// 
main().catch(console.log);
