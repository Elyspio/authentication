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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
var user_entity_1 = require("../src/core/database/entities/user/user.entity");
var roles_entity_1 = require("../src/core/database/entities/user/authorization/roles.entity");
var globals_1 = require("typeorm/globals");
var settings_entity_1 = require("../src/core/database/entities/user/settings.entity");
var process_1 = require("process");
var path = require("path");
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var con, _a, _b, userRepository, user;
    var _c, _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _b = (_a = Promise).all;
                return [4 /*yield*/, (0, globals_1.createConnections)([
                        {
                            type: "mongodb",
                            host: "127.0.0.1",
                            port: 6001,
                            username: (_c = process_1.env.DB_USERNAME) !== null && _c !== void 0 ? _c : "root",
                            password: (_d = process_1.env.DB_PASSWORD) !== null && _d !== void 0 ? _d : "mysecretpassword",
                            database: (_e = process_1.env.DB_DATABASE) !== null && _e !== void 0 ? _e : "admin",
                            synchronize: true,
                            logging: true,
                            entities: [path.resolve(__dirname, "..", "src/core/database/entities/**/*.ts"), path.resolve(__dirname, "..", "src/core/database/entities/*.ts")],
                            migrations: ["src/core/database/migrations/**/*.ts", "src/core/database/migrations/*.ts"],
                            subscribers: ["src/core/database/subscribers/**/*.ts", "src/core/database/subscribers/*.ts"],
                        },
                    ])];
            case 1: return [4 /*yield*/, _b.apply(_a, [_f.sent()])];
            case 2:
                con = (_f.sent())[0];
                userRepository = con.getMongoRepository(user_entity_1.UserEntity);
                return [4 /*yield*/, userRepository.save({
                        username: "Elyspio",
                        hash: "bb7a67bddf50a128e69adaca0b5f0148",
                        authorization: {
                            authentication: {
                                roles: [new roles_entity_1.RolesEntity(roles_entity_1.Roles.User), new roles_entity_1.RolesEntity(roles_entity_1.Roles.Admin)],
                            },
                        },
                        settings: {
                            theme: settings_entity_1.Theme.System,
                        },
                        credentials: {
                            github: {
                                token: "fd0e15cacdea41b2a4f849ddd1db6a84f77b0d22",
                                user: "Elyspio",
                            },
                            docker: {
                                username: "elyspio",
                                password: "MM%56.~Gg(T7G}D;?DG<'r(q@>D`",
                            },
                        },
                    })];
            case 3:
                user = _f.sent();
                return [4 /*yield*/, userRepository.save(user)];
            case 4:
                _f.sent();
                return [2 /*return*/];
        }
    });
}); })();
