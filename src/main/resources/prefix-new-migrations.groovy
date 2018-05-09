/* https://gist.github.com/SlevinBE/7233913 */

import static groovy.io.FileType.*

def incrementalScriptsDir = new File("src/main/resources/db/migration");

/**
 * Traverses all files in the incremental directory, excluding the ones which already
 * start with a number or letter 'R' followed by an underscore.
 * Each of these files will be renamed by prefixing them with a timestamp.
 */
incrementalScriptsDir.traverse(type: FILES, nameFilter: ~/.*\.sql$/,
        excludeNameFilter: ~/(.+\d+|R)_.*/) { file ->
    def timestamp = new Date().format('yyyyMMddHHmmssSSS', TimeZone.getTimeZone('GMT'))
    println "Renaming $file.name to ${timestamp}__$file.name"

    file.renameTo("$file.parentFile.absolutePath${file.separator}V${timestamp}__$file.name")

    sleep(1000)
}
