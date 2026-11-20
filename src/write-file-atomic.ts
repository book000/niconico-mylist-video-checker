import fs from 'node:fs'

/**
 * Writes `data` to `filePath` so that the file is either the previous content
 * or the complete new content, never a partial one.
 *
 * The data is written and fsynced to `<filePath>.tmp` in the same directory,
 * then renamed over the target. The temp file is removed on failure.
 *
 * @param filePath Target file path; its directory must exist
 * @throws The original error when writing or renaming fails
 */
export function writeFileAtomic(filePath: string, data: string): void {
  const tmpPath = `${filePath}.tmp`
  try {
    const fd = fs.openSync(tmpPath, 'w')
    try {
      fs.writeFileSync(fd, data)
      fs.fsyncSync(fd)
    } finally {
      fs.closeSync(fd)
    }
    fs.renameSync(tmpPath, filePath)
  } catch (error) {
    fs.rmSync(tmpPath, { force: true })
    throw error
  }
}
