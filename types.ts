
export type ItemStatus = 'pending' | 'ok' | 'not_ok';

export interface ChecklistItem {
  id: string;
  label: string;
  status: ItemStatus;
}

export interface EquipmentGroup {
  id: string;
  title: string;
  icon: string;
  items: ChecklistItem[];
  photos: string[];
}

export interface InspectionState {
  groups: EquipmentGroup[];
  observation: string;
  date: string;
}
