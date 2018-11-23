'use strict';
const Code = require('code');
const FluxConstant = require('flux-constant');
const Lab = require('lab');
const Proxyquire = require('proxyquire');


const lab = exports.lab = Lab.script();
const stub = {
    ApiActions: {
        post: function () {

            stub.ApiActions.post.mock.apply(null, arguments);
        },
        delete: function () {

            stub.ApiActions.delete.mock.apply(null, arguments);
        }
    }
};
const Actions = Proxyquire('../../../../../client/pages/main/login/actions', {
    '../../../actions/api': stub.ApiActions
});


lab.experiment('Login Actions', () => {

    lab.test('it calls ApiActions.post from forgot', (done) => {

        stub.ApiActions.post.mock = function (url, data, store, typeReq, typeRes, callback) {

            Code.expect(url).to.be.a.string();
            Code.expect(data).to.be.an.object();
            Code.expect(store).to.be.an.object();
            Code.expect(typeReq).to.be.an.instanceof(FluxConstant);
            Code.expect(typeRes).to.be.an.instanceof(FluxConstant);
            Code.expect(callback).to.not.exist();

            done();
        };

        Actions.forgot({});
    });


    lab.test.skip('it calls ApiActions.post from login (redirect to returnUrl)', (done) => {

        const windowLocation = global.window.location;
        const returnUrl = '/deep/link';

        Object.defineProperty(global.window.location, 'search', {
            writable: true,
            value: `?returnUrl=${encodeURIComponent(returnUrl)}`
        });

        Object.defineProperty(global.window.location, 'href', {
            configurable: true,
            set: function (value) {

                Object.defineProperty(global.window.location, 'search', {
                    writable: true,
                    value: ''
                });

                global.window.location = windowLocation;

                Code.expect(value).to.equal(returnUrl);

                done();
            }
        });

        stub.ApiActions.post.mock = function (url, data, store, typeReq, typeRes, callback) {

            Code.expect(url).to.be.a.string();
            Code.expect(data).to.be.an.object();
            Code.expect(store).to.be.an.object();
            Code.expect(typeReq).to.be.an.instanceof(FluxConstant);
            Code.expect(typeRes).to.be.an.instanceof(FluxConstant);
            Code.expect(callback).to.exist();

            callback(null, {});
        };

        Actions.login({});
    });


    lab.test.skip('it calls ApiActions.post from login (redirect to admin)', (done) => {

        const windowLocation = global.window.location;

        Object.defineProperty(global.window.location, 'href', {
            configurable: true,
            set: function (value) {

                global.window.location = windowLocation;

                Code.expect(value).to.equal('/admin');

                done();
            }
        });

        stub.ApiActions.post.mock = function (url, data, store, typeReq, typeRes, callback) {

            Code.expect(url).to.be.a.string();
            Code.expect(data).to.be.an.object();
            Code.expect(store).to.be.an.object();
            Code.expect(typeReq).to.be.an.instanceof(FluxConstant);
            Code.expect(typeRes).to.be.an.instanceof(FluxConstant);
            Code.expect(callback).to.exist();

            callback(null, {
                user: {
                    roles: {
                        admin: {}
                    }
                }
            });
        };

        Actions.login({});
    });


    lab.test.skip('it calls ApiActions.post from login (redirect to account)', (done) => {

        const windowLocation = global.window.location;

        Object.defineProperty(global.window.location, 'href', {
            configurable: true,
            set: function (value) {

                global.window.location = windowLocation;

                Code.expect(value).to.equal('/account');

                done();
            }
        });

        stub.ApiActions.post.mock = function (url, data, store, typeReq, typeRes, callback) {

            Code.expect(url).to.be.a.string();
            Code.expect(data).to.be.an.object();
            Code.expect(store).to.be.an.object();
            Code.expect(typeReq).to.be.an.instanceof(FluxConstant);
            Code.expect(typeRes).to.be.an.instanceof(FluxConstant);
            Code.expect(callback).to.exist();

            callback(null, {
                user: {
                    roles: {
                        account: {}
                    }
                }
            });
        };

        Actions.login({});
    });


    lab.test('it calls ApiActions.post from login (error)', (done) => {

        stub.ApiActions.post.mock = function (url, data, store, typeReq, typeRes, callback) {

            Code.expect(url).to.be.a.string();
            Code.expect(data).to.be.an.object();
            Code.expect(store).to.be.an.object();
            Code.expect(typeReq).to.be.an.instanceof(FluxConstant);
            Code.expect(typeRes).to.be.an.instanceof(FluxConstant);
            Code.expect(callback).to.exist();

            callback(new Error('sorry pal'));

            done();
        };

        Actions.login({});
    });


    lab.test('it calls ApiActions.delete from logout', (done) => {

        stub.ApiActions.delete.mock = function (url, data, store, typeReq, typeRes, callback) {

            Code.expect(url).to.be.a.string();
            Code.expect(data).to.be.undefined();
            Code.expect(store).to.be.an.object();
            Code.expect(typeReq).to.be.an.instanceof(FluxConstant);
            Code.expect(typeRes).to.be.an.instanceof(FluxConstant);
            Code.expect(callback).to.not.exist();

            done();
        };

        Actions.logout();
    });


    lab.test('it calls ApiActions.post from reset', (done) => {

        stub.ApiActions.post.mock = function (url, data, store, typeReq, typeRes, callback) {

            Code.expect(url).to.be.a.string();
            Code.expect(data).to.be.an.object();
            Code.expect(store).to.be.an.object();
            Code.expect(typeReq).to.be.an.instanceof(FluxConstant);
            Code.expect(typeRes).to.be.an.instanceof(FluxConstant);
            Code.expect(callback).to.not.exist();

            done();
        };

        Actions.reset({});
    });
});
