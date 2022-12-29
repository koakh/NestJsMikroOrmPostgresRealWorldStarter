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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestSeeder = void 0;
const seeder_1 = require("@mikro-orm/seeder");
const user_entity_1 = require("../../src/user/user.entity");
class TestSeeder extends seeder_1.Seeder {
    run(em) {
        return __awaiter(this, void 0, void 0, function* () {
            const author = em.create(user_entity_1.User, {
                username: 'John Snow',
                email: 'snow@wall.st',
                password: 'snow@wall.st',
                bio: '',
                image: '',
            });
            em.persist(author);
        });
    }
}
exports.TestSeeder = TestSeeder;
//# sourceMappingURL=test.seeder.js.map