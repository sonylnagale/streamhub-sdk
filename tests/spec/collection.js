define([
    'jasmine',
    'streamhub-sdk/collection',
    'streamhub-sdk/streams/collection-archive',
    'streamhub-sdk/streams/collection-updater',
    'streamhub-sdk/views/list-view',
    'stream/writable',
    'stream/readable'
], function (jasmine, Collection, CollectionArchive, CollectionUpdater, ListView,
Writable, Readable) {
    describe('streamhub-sdk/collection', function () {
        it('is a function', function () {
            expect(Collection).toEqual(jasmine.any(Function));
        });
        describe('instance', function () {
            var opts,
                collection;
            beforeEach(function () {
                opts = {
                    network: 'test.fyre.co',
                    siteId: 'testSiteId',
                    articleId: 'testArticleId',
                    environment: 'test.livefyre.com'
                };
                collection = new Collection(opts);
            });

            it('has .network', function () {
                expect(collection.network).toBe(opts.network);
            });
            it('has .siteId', function () {
                expect(collection.siteId).toBe(opts.siteId);
            });
            it('has .articleId', function () {
                expect(collection.articleId).toBe(opts.articleId);
            });
            it('has .environment', function () {
                expect(collection.environment).toBe(opts.environment);
            });

            describe('.createArchive', function () {
                it('returns a readable CollectionArchive Stream', function () {
                    var archive = collection.createArchive();
                    expect(archive instanceof CollectionArchive).toBe(true);
                });
            });

            describe('.createUpdater', function () {
                it('returns a readable CollectionUpdater Stream', function () {
                    var updater = collection.createUpdater();
                    expect(updater instanceof CollectionUpdater).toBe(true);
                });
            });

            describe('.pipe(writable)', function () {
                var writable,
                    listView;
                beforeEach(function () {
                    writable = new Writable();
                    listView = new ListView();
                    collection.createUpdater = function () {
                        var readable = new Readable();
                        readable._read = function () { this.push(null); };
                        return readable;
                    };
                    collection.createArchive = function () {
                        // Use a Dummy BootstrapClient to prevent requests
                        return Collection.prototype.createArchive.call(this, {
                            bootstrapClient: {
                                getContent: function (opts, errback) {
                                    errback(null, {});
                                }
                            }
                        });
                    };
                    writable._write = function (chunk, done) { done(); }
                });
                it('can be piped to a writable', function () {
                    collection.pipe(writable);
                });
                describe('when piped to a ListView', function () {
                    it('pipes an updater to ListView', function () {
                        var onPipe = jasmine.createSpy('pipe');
                        listView.on('pipe', onPipe);
                        collection.pipe(listView);
                        expect(onPipe).toHaveBeenCalled();
                    });
                    it('pipes an archive to ListView#more', function () {
                        var onPipeToMore = jasmine.createSpy('pipe to more');
                        listView.more.on('pipe', onPipeToMore);
                        collection.pipe(listView);
                        expect(onPipeToMore).toHaveBeenCalledWith(jasmine.any(CollectionArchive));
                    });
                });
            });
        });
    });
});