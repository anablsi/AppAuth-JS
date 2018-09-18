"use strict";
/*
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the
 * License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var base64 = require("base64-js");
var errors_1 = require("./errors");
var HAS_CRYPTO = typeof window !== 'undefined' && !!window.crypto;
var HAS_SUBTLE_CRYPTO = HAS_CRYPTO && !!window.crypto.subtle;
var HAS_TEXT_ENCODER = typeof window !== 'undefined' && !!(TextEncoder);
var CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
function bufferToString(buffer) {
    var state = [];
    for (var i = 0; i < buffer.byteLength; i += 1) {
        var index = buffer[i] % CHARSET.length;
        state.push(CHARSET[index]);
    }
    return state.join('');
}
exports.bufferToString = bufferToString;
function urlSafe(buffer) {
    var encoded = base64.fromByteArray(new Uint8Array(buffer));
    return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}
exports.urlSafe = urlSafe;
/**
 * The default implementation of the `Crypto` interface.
 * This uses the capabilities of the browser.
 */
var DefaultCrypto = /** @class */ (function () {
    function DefaultCrypto() {
    }
    DefaultCrypto.prototype.generateRandom = function (size) {
        var buffer = new Uint8Array(size);
        if (HAS_CRYPTO) {
            window.crypto.getRandomValues(buffer);
        }
        else {
            // fall back to Math.random() if nothing else is available
            for (var i = 0; i < size; i += 1) {
                buffer[i] = Math.random();
            }
        }
        return bufferToString(buffer);
    };
    DefaultCrypto.prototype.deriveChallenge = function (code) {
        if (code.length < 43 || code.length > 128) {
            return Promise.reject(new errors_1.AppAuthError('Invalid code length.'));
        }
        if (!HAS_SUBTLE_CRYPTO) {
            return Promise.reject(new errors_1.AppAuthError('window.crypto.subtle is unavailable.'));
        }
        if (!HAS_TEXT_ENCODER) {
            return Promise.reject(new errors_1.AppAuthError('TextEncoder is unavailable.'));
        }
        var encoder = new TextEncoder();
        return new Promise(function (resolve, reject) {
            crypto.subtle.digest('SHA-256', encoder.encode(code)).then(function (buffer) {
                return resolve(urlSafe(new Uint8Array(buffer)));
            }, function (error) { return reject(error); });
        });
    };
    return DefaultCrypto;
}());
exports.DefaultCrypto = DefaultCrypto;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3J5cHRvX3V0aWxzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NyeXB0b191dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7Ozs7Ozs7OztHQVlHOztBQUVILGtDQUFvQztBQUVwQyxtQ0FBc0M7QUFFdEMsSUFBTSxVQUFVLEdBQUcsT0FBTyxNQUFNLEtBQUssV0FBVyxJQUFJLENBQUMsQ0FBRSxNQUFNLENBQUMsTUFBYyxDQUFDO0FBQzdFLElBQU0saUJBQWlCLEdBQUcsVUFBVSxJQUFJLENBQUMsQ0FBRSxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQWMsQ0FBQztBQUN4RSxJQUFNLGdCQUFnQixHQUFHLE9BQU8sTUFBTSxLQUFLLFdBQVcsSUFBSSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUMxRSxJQUFNLE9BQU8sR0FBRyxnRUFBZ0UsQ0FBQztBQUVqRixTQUFnQixjQUFjLENBQUMsTUFBa0I7SUFDL0MsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDO0lBQ2YsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUM3QyxJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQztRQUN2QyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0tBQzVCO0lBQ0QsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3hCLENBQUM7QUFQRCx3Q0FPQztBQUVELFNBQWdCLE9BQU8sQ0FBQyxNQUFrQjtJQUN4QyxJQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDLElBQUksVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDN0QsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDM0UsQ0FBQztBQUhELDBCQUdDO0FBY0Q7OztHQUdHO0FBQ0g7SUFBQTtJQWdDQSxDQUFDO0lBL0JDLHNDQUFjLEdBQWQsVUFBZSxJQUFZO1FBQ3pCLElBQU0sTUFBTSxHQUFHLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3BDLElBQUksVUFBVSxFQUFFO1lBQ2QsTUFBTSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDdkM7YUFBTTtZQUNMLDBEQUEwRDtZQUMxRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ2hDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7YUFDM0I7U0FDRjtRQUNELE9BQU8sY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUFFRCx1Q0FBZSxHQUFmLFVBQWdCLElBQVk7UUFDMUIsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsRUFBRTtZQUN6QyxPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxxQkFBWSxDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQztTQUNqRTtRQUNELElBQUksQ0FBQyxpQkFBaUIsRUFBRTtZQUN0QixPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxxQkFBWSxDQUFDLHNDQUFzQyxDQUFDLENBQUMsQ0FBQztTQUNqRjtRQUNELElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtZQUNyQixPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxxQkFBWSxDQUFDLDZCQUE2QixDQUFDLENBQUMsQ0FBQztTQUN4RTtRQUVELElBQU0sT0FBTyxHQUFHLElBQUksV0FBVyxFQUFFLENBQUM7UUFDbEMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxNQUFNO1lBQ2pDLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsTUFBTTtnQkFDL0QsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsRCxDQUFDLEVBQUUsVUFBQSxLQUFLLElBQUksT0FBQSxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQWIsQ0FBYSxDQUFDLENBQUM7UUFDN0IsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBQ0gsb0JBQUM7QUFBRCxDQUFDLEFBaENELElBZ0NDO0FBaENZLHNDQUFhIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBJbmMuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHRcbiAqIGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlciB0aGVcbiAqIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyXG4gKiBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCAqIGFzIGJhc2U2NCBmcm9tICdiYXNlNjQtanMnO1xuXG5pbXBvcnQge0FwcEF1dGhFcnJvcn0gZnJvbSAnLi9lcnJvcnMnO1xuXG5jb25zdCBIQVNfQ1JZUFRPID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgISEod2luZG93LmNyeXB0byBhcyBhbnkpO1xuY29uc3QgSEFTX1NVQlRMRV9DUllQVE8gPSBIQVNfQ1JZUFRPICYmICEhKHdpbmRvdy5jcnlwdG8uc3VidGxlIGFzIGFueSk7XG5jb25zdCBIQVNfVEVYVF9FTkNPREVSID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgISEoVGV4dEVuY29kZXIpO1xuY29uc3QgQ0hBUlNFVCA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBidWZmZXJUb1N0cmluZyhidWZmZXI6IFVpbnQ4QXJyYXkpIHtcbiAgbGV0IHN0YXRlID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYnVmZmVyLmJ5dGVMZW5ndGg7IGkgKz0gMSkge1xuICAgIGxldCBpbmRleCA9IGJ1ZmZlcltpXSAlIENIQVJTRVQubGVuZ3RoO1xuICAgIHN0YXRlLnB1c2goQ0hBUlNFVFtpbmRleF0pO1xuICB9XG4gIHJldHVybiBzdGF0ZS5qb2luKCcnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVybFNhZmUoYnVmZmVyOiBVaW50OEFycmF5KTogc3RyaW5nIHtcbiAgY29uc3QgZW5jb2RlZCA9IGJhc2U2NC5mcm9tQnl0ZUFycmF5KG5ldyBVaW50OEFycmF5KGJ1ZmZlcikpO1xuICByZXR1cm4gZW5jb2RlZC5yZXBsYWNlKC9cXCsvZywgJy0nKS5yZXBsYWNlKC9cXC8vZywgJ18nKS5yZXBsYWNlKC89L2csICcnKTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBDcnlwdG8ge1xuICAvKipcbiAgICogR2VuZXJhdGUgYSByYW5kb20gc3RyaW5nXG4gICAqL1xuICBnZW5lcmF0ZVJhbmRvbShzaXplOiBudW1iZXIpOiBzdHJpbmc7XG4gIC8qKlxuICAgKiBDb21wdXRlIHRoZSBTSEEyNTYgb2YgYSBnaXZlbiBjb2RlLlxuICAgKiBUaGlzIGlzIHVzZWZ1bCB3aGVuIHVzaW5nIFBLQ0UuXG4gICAqL1xuICBkZXJpdmVDaGFsbGVuZ2UoY29kZTogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+O1xufVxuXG4vKipcbiAqIFRoZSBkZWZhdWx0IGltcGxlbWVudGF0aW9uIG9mIHRoZSBgQ3J5cHRvYCBpbnRlcmZhY2UuXG4gKiBUaGlzIHVzZXMgdGhlIGNhcGFiaWxpdGllcyBvZiB0aGUgYnJvd3Nlci5cbiAqL1xuZXhwb3J0IGNsYXNzIERlZmF1bHRDcnlwdG8gaW1wbGVtZW50cyBDcnlwdG8ge1xuICBnZW5lcmF0ZVJhbmRvbShzaXplOiBudW1iZXIpIHtcbiAgICBjb25zdCBidWZmZXIgPSBuZXcgVWludDhBcnJheShzaXplKTtcbiAgICBpZiAoSEFTX0NSWVBUTykge1xuICAgICAgd2luZG93LmNyeXB0by5nZXRSYW5kb21WYWx1ZXMoYnVmZmVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gZmFsbCBiYWNrIHRvIE1hdGgucmFuZG9tKCkgaWYgbm90aGluZyBlbHNlIGlzIGF2YWlsYWJsZVxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpICs9IDEpIHtcbiAgICAgICAgYnVmZmVyW2ldID0gTWF0aC5yYW5kb20oKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGJ1ZmZlclRvU3RyaW5nKGJ1ZmZlcik7XG4gIH1cblxuICBkZXJpdmVDaGFsbGVuZ2UoY29kZTogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICBpZiAoY29kZS5sZW5ndGggPCA0MyB8fCBjb2RlLmxlbmd0aCA+IDEyOCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBBcHBBdXRoRXJyb3IoJ0ludmFsaWQgY29kZSBsZW5ndGguJykpO1xuICAgIH1cbiAgICBpZiAoIUhBU19TVUJUTEVfQ1JZUFRPKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEFwcEF1dGhFcnJvcignd2luZG93LmNyeXB0by5zdWJ0bGUgaXMgdW5hdmFpbGFibGUuJykpO1xuICAgIH1cbiAgICBpZiAoIUhBU19URVhUX0VOQ09ERVIpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgQXBwQXV0aEVycm9yKCdUZXh0RW5jb2RlciBpcyB1bmF2YWlsYWJsZS4nKSk7XG4gICAgfVxuXG4gICAgY29uc3QgZW5jb2RlciA9IG5ldyBUZXh0RW5jb2RlcigpO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjcnlwdG8uc3VidGxlLmRpZ2VzdCgnU0hBLTI1NicsIGVuY29kZXIuZW5jb2RlKGNvZGUpKS50aGVuKGJ1ZmZlciA9PiB7XG4gICAgICAgIHJldHVybiByZXNvbHZlKHVybFNhZmUobmV3IFVpbnQ4QXJyYXkoYnVmZmVyKSkpO1xuICAgICAgfSwgZXJyb3IgPT4gcmVqZWN0KGVycm9yKSk7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==