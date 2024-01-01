'use strict'
const { makePathsRelative } = require('webpack/lib/util/identifier')
const numberHash = require('webpack/lib/util/numberHash')

class StableChunkIdsPlugin {
  constructor(options) {
    this.delimiter = (options && options.delimiter) || '-'
    this.context = options && options.context
    this.range = (options && options.range) || 0x80000000
    this.cachedIds = new Set()
  }

  setStableId(chunk, path) {
    let id = numberHash(path, this.range)
    if (this.cachedIds.has(id)) {
      let i = 1
      do {
        if (!this.cachedIds.has(`${id}-${i}`)) {
          id = `${id}-${i}`
          break
        }
      } while (i++)
    }
    this.cachedIds.add(id)
    chunk.id = id
    chunk.ids = [id]
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('StableChunkIdsPlugin', (compilation) => {
      compilation.hooks.chunkIds.tap('StableChunkIdsPlugin', (chunks) => {
        const chunkGraph = compilation.chunkGraph
        const context = this.context ? this.context : compiler.context

        for (const chunk of chunks) {
          if (chunk.name) {
            chunk.id = chunk.name
            chunk.ids = [chunk.name]
          } else {
            const modules = chunkGraph.getChunkRootModules(chunk)
            const entryModule = modules[0]
            if (entryModule) {
              const libIdent = entryModule.libIdent({ context, associatedObjectForCache: compiler.root })
              if (libIdent) {
                this.setStableId(chunk, libIdent)
              } else {
                const nameForCondition = entryModule.nameForCondition()
                const relativeNameForCondition = makePathsRelative(context, nameForCondition, compiler.root)
                this.setStableId(chunk, relativeNameForCondition)
              }
            }
          }
        }
      })
    })
  }
}

module.exports = StableChunkIdsPlugin
