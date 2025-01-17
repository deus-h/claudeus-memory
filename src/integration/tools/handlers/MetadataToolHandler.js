"use strict";
// src/tools/handlers/MetadataToolHandler.ts
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
exports.MetadataToolHandler = void 0;
const BaseToolHandler_js_1 = require("./BaseToolHandler.js");
const index_js_1 = require("@shared/index.js");
class MetadataToolHandler extends BaseToolHandler_js_1.BaseToolHandler {
    handleTool(name, args) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.validateArguments(args);
                switch (name) {
                    case "add_metadata":
                        const addResult = yield this.knowledgeGraphManager.addMetadata(args.metadata);
                        return (0, index_js_1.formatToolResponse)({
                            data: { metadata: addResult },
                            actionTaken: "Added metadata to nodes"
                        });
                    case "delete_metadata":
                        yield this.knowledgeGraphManager.deleteMetadata(args.deletions);
                        return (0, index_js_1.formatToolResponse)({
                            actionTaken: "Deleted metadata from nodes"
                        });
                    default:
                        throw new Error(`Unknown metadata operation: ${name}`);
                }
            }
            catch (error) {
                return (0, index_js_1.formatToolError)({
                    operation: name,
                    error: error instanceof Error ? error.message : 'Unknown error occurred',
                    context: { args },
                    suggestions: [
                        "Verify node existence",
                        "Check metadata format"
                    ],
                    recoverySteps: [
                        "Ensure nodes exist before adding metadata",
                        "Verify metadata content format"
                    ]
                });
            }
        });
    }
}
exports.MetadataToolHandler = MetadataToolHandler;
