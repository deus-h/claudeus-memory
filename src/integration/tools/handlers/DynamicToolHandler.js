"use strict";
// src/tools/handlers/DynamicToolHandler.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamicToolHandler = void 0;
const BaseToolHandler_js_1 = require("./BaseToolHandler.js");
const index_js_1 = require("@integration/index.js");
const index_js_2 = require("@shared/index.js");
class DynamicToolHandler extends BaseToolHandler_js_1.BaseToolHandler {
    handleTool(name, args) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                this.validateArguments(args);
                const toolResult = yield index_js_1.dynamicToolManager.handleToolCall(name, args, this.knowledgeGraphManager);
                if (((_a = toolResult === null || toolResult === void 0 ? void 0 : toolResult.toolResult) === null || _a === void 0 ? void 0 : _a.isError) !== undefined) {
                    return toolResult;
                }
                return (0, index_js_2.formatToolResponse)({
                    data: toolResult,
                    actionTaken: `Executed dynamic tool: ${name}`
                });
            }
            catch (error) {
                return (0, index_js_2.formatToolError)({
                    operation: name,
                    error: error instanceof Error ? error.message : 'Unknown error occurred',
                    context: { toolName: name, args },
                    suggestions: [
                        "Examine the tool input parameters for correctness",
                        "Verify that the requested operation is supported"
                    ],
                    recoverySteps: [
                        "Adjust the input parameters based on the schema definition"
                    ]
                });
            }
        });
    }
}
exports.DynamicToolHandler = DynamicToolHandler;
