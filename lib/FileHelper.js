const fs = require('fs-jetpack');

const FileHelper = function() {
    this.core = fs;

    this.filterValidPaths = function(paths) {
        const validPaths = [];

        for (path of paths) {
            if (this.core.exists(path) !== false)
                validPaths.push(path);
        }

        return validPaths
    }

    /**
     * Recursively map over all files in a directory and it's subdirectory files
     *
     * @param path
     * // Callback gets file path, expected return is void
     * @param callback :: string -> void
     */
    this.recursivelyMapDirectoryFiles = function(path, callback) {
        const tree = this.core.inspectTree(path, { relativePath: true });

        for (entity of tree.children) {
            const entityPath = path + "/" + entity.relativePath;

            if (entity.type === "dir") {
                this.recursivelyMapDirectoryFiles(entityPath, callback);
            } else if (entity.type === "file") {
                callback(entityPath);
            }
        }
    }
}

module.exports = FileHelper;