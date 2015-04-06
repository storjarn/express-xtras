module.exports = {
    /**
     * Creates an instance of an object to be used in crypto methods.
     * @class Tools.Crypto.Crypto
     * @param algo {String | null} A string referencing the algorithim to use fo encryption.  Defaults to sha256.
     * @param enco {String | null} A string referencing the encoding the encrypted string should be returned as.  Defaults to base64.
     */
    Crypto: function(algo, enco) {
        var i = this;
        var algorithm = algo || 'sha256';
        var crypto = require('crypto');
        var encoding = enco || 'base64';

        /**
         * Uses the Crypto module to create a one way hash.
         * @function hash
         * @memberof Tools.Crypto.Crypto
         * @param data {string} The string to encrypt
         * @returns {string} A string in the specified encoding or base64 by default.
         */
        this.hash = function(data) {
            return crypto.createHash(algorithm)
                .update(data)
                .digest(encoding);
        };

        /**
         * Key encrypts data using the Crypto Module
         * @function hmac
         * @memberof Tools.Crypto.Crypto
         * @param data {string} The string to encrypt
         * @param key {string} The key to use for the encryption.  If one is not provided, a random string will be used for the key creating a one way encruption.
         * @returns {string} The encoded encrypted string.
         */
        this.hmac = function(data, key) {
            return crypto.createHmac(algorithm, key || this.hash(module.exports.randomString())).update(data).digest(encoding);
        };

    },

    /**
     * Returns a oneway encrypted string of provided data
     * @function Tools.Crypto.hash
     * @param data {String}  The data string to encrypt
     * @returns {String} An base64 encoded encrypted string of data
     */
    hash: function(data) {
        var crypto = new module.exports.Crypto();
        return crypto.hash(data);
    },

    /**
     * A key encrypted string of provided data
     * @function Tools.Crypto.hmac
     * @param data {String}  The data string to encrypt
     * @param key {String} The key to use for the encryption
     * @returns {String} A base 64 encoded encrypted string of data.
     */
    hmac: function(data, key) {
        var crypto = new module.exports.Crypto();
        return crypto.hmac(data, key);
    },

    /**
     * Provides a random string
     * @function Tools.Crypto.randomString
     * @param prefix {String | null} For more randomization, you can pass a prefix string to be added to the generated data to be encrypted
     * @param suffix {String | null} For more randomization, you can pass a suffix string to be added to the generated data to be encrypted
     * @returns {String} Returns a random string
     */
    randomString: function(prefix, suffix) {
        var crypto = new module.exports.Crypto();
        var now = new Date();
        var string = now.getTime().toString() + now.getMilliseconds().toString() + Math.random().toString();
        string = ((typeof prefix !== 'undefined') ? prefix : '') + string + ((typeof suffix !== 'undefined') ? suffix : '');
        return crypto.hash(string);
    },

    randomStringFixed: function(length) {
        var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
        return result;
    },

    randomNumber: function(min, max, bAsInt) {
        min = min || 0;
        max = max || 1;
        bAsInt = bAsInt || true;
        return function() {
            if (bAsInt) {
                return (Math.floor(Math.random() * (max - min + 1))) + min;
            } else {
                return (Math.random() * (max - min)) + min;
            }
        };
    },

    enocodeBase64: function(str) {
        return new Buffer(str).toString('base64');
    },

    decodeBase64: function(str) {
        return new Buffer(str, 'base64').toString('ascii');
    },

    /**
     * Randomize array element order in-place.
     * Using Fisher-Yates shuffle algorithm.
     */
    shuffleArray: function(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    },

    GUID: function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
};
