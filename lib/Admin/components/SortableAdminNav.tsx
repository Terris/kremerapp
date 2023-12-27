import {
  SortableList,
  SortableListItem,
} from "@/lib/providers/SortableListProvider";

export interface SortableAdminNavListProps<
  ItemType,
  KeyExtractor extends string
> {
  data: ({ [K in KeyExtractor]: string } & ItemType)[];
  sortableItemIds: string[];
  onUpdate: (updatedItems: string[]) => void;
  renderItem: (item: ItemType) => React.ReactNode;
  keyExtractor: KeyExtractor;
}

export function SortableAdminNavList<ItemType, KeyExtractor extends string>({
  data,
  sortableItemIds,
  keyExtractor,
  onUpdate,
  renderItem,
}: SortableAdminNavListProps<ItemType, KeyExtractor>) {
  return (
    <SortableList items={sortableItemIds} onUpdate={onUpdate}>
      <div className="flex flex-col gap-2">
        {data.map((item) => (
          <SortableListItem key={item[keyExtractor]} id={item[keyExtractor]}>
            {renderItem(item)}
          </SortableListItem>
        ))}
      </div>
    </SortableList>
  );
}
