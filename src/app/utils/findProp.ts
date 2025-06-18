export function FindValueFromObj<TObject, TKey extends keyof TObject>(
  searchable: Array<TObject>,
  property: TKey,
  valueToCompare: TObject[TKey]
) {
  return (
    searchable.find((reaction) => reaction[property] === valueToCompare) ?? null
  );
}
