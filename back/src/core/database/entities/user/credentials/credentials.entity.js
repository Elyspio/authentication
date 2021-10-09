"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CredentialsEntity = void 0;
var typeorm_1 = require("typeorm");
var docker_entity_1 = require("./docker.entity");
var github_entity_1 = require("./github.entity");
var CredentialsEntity = /** @class */ (function () {
    function CredentialsEntity() {
    }
    __decorate([
        (0, typeorm_1.Column)(function () { return github_entity_1.GithubEntity; })
    ], CredentialsEntity.prototype, "github", void 0);
    __decorate([
        (0, typeorm_1.Column)(function () { return docker_entity_1.DockerEntity; })
    ], CredentialsEntity.prototype, "docker", void 0);
    return CredentialsEntity;
}());
exports.CredentialsEntity = CredentialsEntity;
