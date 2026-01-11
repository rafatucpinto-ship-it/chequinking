
import { EquipmentGroup } from './types';

export const INITIAL_EQUIPMENT_DATA: EquipmentGroup[] = [
  {
    id: 'fusao',
    title: 'Máquina de Fusão',
    icon: '🔧',
    items: [
      { id: 'fusao-1', label: 'Verificar Máquina de Fusão', status: 'pending' },
      { id: 'fusao-2', label: 'Verificar Carregador', status: 'pending' },
      { id: 'fusao-3', label: 'Equipamento Carregado', status: 'pending' },
      { id: 'fusao-4', label: 'Higienização', status: 'pending' },
    ],
    photos: []
  },
  {
    id: 'otdr',
    title: 'OTDR',
    icon: '📡',
    items: [
      { id: 'otdr-1', label: 'Verificar OTDR', status: 'pending' },
      { id: 'otdr-2', label: 'Verificar Carregador', status: 'pending' },
      { id: 'otdr-3', label: 'Equipamento Carregado', status: 'pending' },
      { id: 'otdr-4', label: 'Higienização', status: 'pending' },
    ],
    photos: []
  },
  {
    id: 'metalico',
    title: 'Testador Metálico',
    icon: '🔌',
    items: [
      { id: 'metalico-1', label: 'Verificar Equipamento', status: 'pending' },
      { id: 'metalico-2', label: 'Verificar Carregador', status: 'pending' },
      { id: 'metalico-3', label: 'Equipamento Carregado', status: 'pending' },
      { id: 'metalico-4', label: 'Higienização', status: 'pending' },
    ],
    photos: []
  },
  {
    id: 'kit-fibra',
    title: 'Kit de Fibra Óptica',
    icon: '🧰',
    items: [
      { id: 'kit-1', label: 'Verificar todos os componentes', status: 'pending' },
    ],
    photos: []
  },
  {
    id: 'profitracer',
    title: 'Profitracer',
    icon: '📟',
    items: [
      { id: 'pro-1', label: 'Inspeção realizada', status: 'pending' },
    ],
    photos: []
  },
  {
    id: 'celular',
    title: 'Celular do Turno + Carregador',
    icon: '📱',
    items: [
      { id: 'cel-1', label: 'Inspeção realizada', status: 'pending' },
    ],
    photos: []
  },
  {
    id: 'cabos',
    title: 'Cabos Console',
    icon: '🔗',
    items: [
      { id: 'cab-1', label: 'Inspeção realizada', status: 'pending' },
    ],
    photos: []
  },
];
