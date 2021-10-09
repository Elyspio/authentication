"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEntity = void 0;
var typeorm_1 = require("typeorm");
var credentials_entity_1 = require("./credentials/credentials.entity");
var settings_entity_1 = require("./settings.entity");
var UserEntity = /** @class */ (function () {
    function UserEntity() {
    }
    __decorate([
        (0, typeorm_1.ObjectIdColumn)()
    ], UserEntity.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)()
    ], UserEntity.prototype, "username", void 0);
    __decorate([
        (0, typeorm_1.Column)()
    ], UserEntity.prototype, "hash", void 0);
    __decorate([
        (0, typeorm_1.Column)(function () { return credentials_entity_1.CredentialsEntity; })
    ], UserEntity.prototype, "credentials", void 0);
    __decorate([
        (0, typeorm_1.Column)(function () { return settings_entity_1.SettingsEntity; })
    ], UserEntity.prototype, "settings", void 0);
    __decorate([
        (0, typeorm_1.Column)(function () { return settings_entity_1.SettingsEntity; })
    ], UserEntity.prototype, "authorization", void 0);
    UserEntity = __decorate([
        (0, typeorm_1.Entity)("users"),
        (0, typeorm_1.Unique)(["username"])
    ], UserEntity);
    return UserEntity;
}());
exports.UserEntity = UserEntity;
