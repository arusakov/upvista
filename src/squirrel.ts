
export function getSquirrelResponse(url: string, name?: string, notes?: string, date?: Date) {
  // https://github.com/Squirrel/Squirrel.Mac#update-json-format
  return {
    url,
    name,
    notes,
    pub_date: date && date.toISOString()
  }
}
