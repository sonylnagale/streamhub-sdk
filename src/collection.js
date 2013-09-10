define([
    'streamhub-sdk/streams/collection-archive',
    'streamhub-sdk/streams/collection-updater',
    'stream/passthrough',
    'inherits'],
function (CollectionArchive, CollectionUpdater, PassThrough, inherits) {
    /**
     * An Object that represents a hosted StreamHub Collection
     */
    function Collection (opts) {
        this.network = opts.network;
        this.siteId = opts.siteId;
        this.articleId = opts.articleId;
        this.environment = opts.environment;

        // Internal streams
        this._updater = null;
        this._pipedArchives = [];

        PassThrough.call(this, opts);
    }
    inherits(Collection, PassThrough);

    /**
     * Create a readable stream that will read through the Collection Archive
     * The Collection Archive contains older Content in the Collection
     * @param opts {object}
     * @param [opts.bootstrapClient] {BootstrapClient} A bootstrapClient to
     *     construct the CollectionArchive with
     * @returns {streamhub-sdk/streams/collection-archive}
     */
    Collection.prototype.createArchive = function (opts) {
        opts = opts || {};
        return new CollectionArchive({
            network: this.network,
            siteId: this.siteId,
            articleId: this.articleId,
            environment: this.environment,
            bootstrapClient: opts.bootstrapClient
        });
    };


    /**
     * Create a Readable Stream that will stream any new updates to the
     * collection like additions, removals, edits, etc.
     */
    Collection.prototype.createUpdater = function () {
        return new CollectionUpdater({
            network: this.network,
            siteId: this.siteId,
            articleId: this.articleId,
            environment: this.environment,
        });
    };


    /**
     * Pipe updates in the Collection the passed destination Writable
     * @param writable {Writable} The destination to pipe udpates to
     * @param opts {object}
     * @param [opts.pipeArchiveToMore=true] Whether to try to pipe
     *     a CollectionArchive to writable.more, if it is also writable
     *     This is helpful when piping to a ListView
     */
    Collection.prototype.pipe = function (writable, opts) {
        var self = this,
            archive;
        opts = opts || {};
        if (typeof opts.pipeArchiveToMore === 'undefined') {
            opts.pipeArchiveToMore = true;
        }

        // Create an internal updater the first time the Collection is piped
        if ( ! this._updater) {
            this._updater = this.createUpdater();
            this._updater.pipe(this);
        }

        PassThrough.prototype.pipe.apply(this, arguments);

        // If piped to a ListView (or something with a .more),
        // pipe an archive to .more
        if (opts.pipeArchiveToMore && writable.more && writable.more.writable) {
            archive = this.createArchive()
            archive.pipe(writable.more);
            this._pipedArchives.push(archive);
        }
    };


    return Collection;
});