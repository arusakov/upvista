type VersionsAndPlatform = {
  platform?: string
  version?: string
}

type PlatformsMap = {
  [index: string]: number | undefined;
}
const platforms: PlatformsMap = require('../platforms.json') // tslint:disable-line

export function createValidator(capacity: number) {
  return ({ platform = '', version = '' }: VersionsAndPlatform) => {
    const platformId = platforms[platform]
    if (!platformId) {
      return null
    }

    const versionArr = parseVersion(version, capacity)
    if (!versionArr) {
      return null
    }

    return {
      platformId,
      version: versionArr
    }
  }
}

function parseVersion(s: string = '', capacity: number): number[] | null {
  const parts = s.split('.')

  if (parts.length !== capacity) {
    return null
  }

  const versions: number[] = []
  for (const p of parts) {
    const v = Number(p)
    if (isNaN(v) || v < 0) {
      return null
    }
    versions.push(v)
  }

  return versions

}
