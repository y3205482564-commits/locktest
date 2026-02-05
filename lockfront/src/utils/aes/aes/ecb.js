import { AES } from './aes';
import { joinBytes } from '../other/utils';
var AES_ECB = /** @class */ (function () {
    function AES_ECB(key, padding, aes) {
        if (padding === void 0) { padding = false; }
        this.aes = aes ? aes : new AES(key, undefined, padding, 'ECB');
    }
    AES_ECB.encrypt = function (data, key, padding) {
        if (padding === void 0) { padding = false; }
        return new AES_ECB(key, padding).encrypt(data);
    };
    AES_ECB.decrypt = function (data, key, padding) {
        if (padding === void 0) { padding = false; }
        return new AES_ECB(key, padding).decrypt(data);
    };
    AES_ECB.prototype.encrypt = function (data) {
        var r1 = this.aes.AES_Encrypt_process(data);
        var r2 = this.aes.AES_Encrypt_finish();
        return joinBytes(r1, r2);
    };
    AES_ECB.prototype.decrypt = function (data) {
        var r1 = this.aes.AES_Decrypt_process(data);
        var r2 = this.aes.AES_Decrypt_finish();
        return joinBytes(r1, r2);
    };
    return AES_ECB;
}());
export { AES_ECB };

