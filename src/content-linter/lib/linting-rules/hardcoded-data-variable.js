import { addError, ellipsify } from 'markdownlint-rule-helpers'

import { getRange } from '../helpers/utils.js'
import frontmatter from '#src/frame/lib/read-frontmatter.js'

/*
  This rule currently only checks for one hardcoded string but
  can be generalized in the future to check for strings that 
  have data variables.
*/
export const hardcodedDataVariable = {
  names: ['GHD005', 'hardcoded-data-variable'],
  description:
    'Strings that contain "personal access token" should use the product variable instead',
  tags: ['single-source'],
  function: (params, onError) => {
    const frontmatterString = params.frontMatterLines.join('\n')
    const fm = frontmatter(frontmatterString).data
    if (fm && fm.autogenerated) return
    for (let i = 0; i < params.lines.length; i++) {
      const line = params.lines[i]
      const regex = /personal access tokens?/gi
      const matches = line.match(regex)
      if (!matches) continue

      for (const match of matches) {
        const lineNumber = i + 1
        const range = getRange(line, match)
        addError(
          onError,
          lineNumber,
          `The string ${match} can be replaced with a variable. You should use one of the variables from data/variables/product.yml instead of the literal phrase(s).`,
          ellipsify(line),
          range,
          null, // No fix possible
        )
      }
    }
  },
}
